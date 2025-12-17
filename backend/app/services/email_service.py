"""
Email service for sending magic links and notifications.
Uses SendGrid HTTP API (more reliable than SMTP on cloud platforms).
"""

import httpx
from typing import List
from app.config import settings


async def send_email(to: str, subject: str, html_body: str):
    """
    Send an email using SendGrid HTTP API.

    Args:
        to: Recipient email address
        subject: Email subject
        html_body: HTML content of the email
    """
    try:
        # SendGrid API endpoint
        url = "https://api.sendgrid.com/v3/mail/send"

        # Prepare email data
        data = {
            "personalizations": [
                {
                    "to": [{"email": to}],
                    "subject": subject
                }
            ],
            "from": {
                "email": settings.SMTP_FROM_EMAIL,
                "name": settings.SMTP_FROM_NAME
            },
            "content": [
                {
                    "type": "text/html",
                    "value": html_body
                }
            ]
        }

        # Headers with API key
        headers = {
            "Authorization": f"Bearer {settings.SMTP_PASSWORD}",  # SendGrid API key
            "Content-Type": "application/json"
        }

        # Send via HTTP POST
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers, timeout=10.0)
            response.raise_for_status()

        print(f"✅ Email sent successfully to {to}")

    except httpx.HTTPStatusError as e:
        print(f"❌ SendGrid API error: {e.response.status_code} - {e.response.text}")
        raise Exception(f"Failed to send email: {e.response.text}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        raise


async def send_magic_link_email(email: str, magic_link_url: str):
    """
    Send a magic link email for passwordless authentication.

    Args:
        email: Recipient's email address
        magic_link_url: Full URL for the magic link
    """
    subject = f"Login to {settings.APP_NAME}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #F97316;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
            }}
            .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Login to {settings.APP_NAME}</h2>
            <p>Click the button below to log in to your account. This link will expire in {settings.MAGIC_LINK_EXPIRATION_MINUTES} minutes.</p>
            <p style="margin: 30px 0;">
                <a href="{magic_link_url}" class="button">Log In</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{magic_link_url}</p>
            <div class="footer">
                <p>If you didn't request this login link, you can safely ignore this email.</p>
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """

    await send_email(to=email, subject=subject, html_body=html_body)


async def send_expiration_reminder(tickets: List[dict], recipient: str, pm_name: str):
    """
    Send an expiration reminder email for tickets.

    Args:
        tickets: List of ticket dictionaries with expiration info
        recipient: Email address to send to
        pm_name: Name of the project manager
    """
    subject = f"{settings.APP_NAME}: {len(tickets)} ticket(s) expiring soon"

    # Build ticket list HTML
    ticket_items = ""
    for ticket in tickets:
        urgency_class = "urgent" if ticket["days_remaining"] <= 2 else ""
        ticket_items += f"""
        <div class="ticket-item {urgency_class}">
            <h3>{ticket["ticket_number"]} - {ticket["job_name"]}</h3>
            <p><strong>Address:</strong> {ticket["address"]}</p>
            <p><strong>Expires:</strong> {ticket["expiration_date"]} ({ticket["days_remaining"]} days remaining)</p>
            <a href="{settings.FRONTEND_URL}/tickets/{ticket["id"]}" class="btn">View & Renew</a>
        </div>
        """

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 700px; margin: 0 auto; padding: 20px; }}
            .ticket-list {{ margin: 20px 0; }}
            .ticket-item {{
                padding: 15px;
                margin: 15px 0;
                border-left: 4px solid #F59E0B;
                background-color: #FEF3C7;
                border-radius: 4px;
            }}
            .ticket-item.urgent {{
                border-left-color: #EF4444;
                background-color: #FEE2E2;
            }}
            .btn {{
                display: inline-block;
                padding: 10px 20px;
                background-color: #3B82F6;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
            }}
            .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>811 Ticket Expiration Reminder</h2>
            <p>Hello {pm_name},</p>
            <p>You have <strong>{len(tickets)}</strong> ticket(s) expiring soon:</p>

            <div class="ticket-list">
                {ticket_items}
            </div>

            <p><strong>Don't forget to renew tickets before they expire to maintain compliance!</strong></p>

            <div class="footer">
                <p>This is an automated reminder from {settings.APP_NAME}.</p>
                <p><a href="{settings.FRONTEND_URL}/tickets">View all tickets</a></p>
            </div>
        </div>
    </body>
    </html>
    """

    await send_email(to=recipient, subject=subject, html_body=html_body)
