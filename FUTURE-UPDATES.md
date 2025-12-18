# Future Updates for 811 Ticket Tracker

This file tracks requested updates, bug fixes, and improvements for the 811 Ticket Tracker app.

## Bugs to Fix

---

## Improvements & New Features

---

## General Notes

### Latest Update (v1.3.0) - Navigation and UX Improvements
**Date**: 2025-12-18
**Commit**: ea982ea

**Improvements Implemented**:
1. ✅ Added Back button to Terms and Privacy pages
   - Uses browser history navigation (navigate(-1))
   - Consistent ArrowLeft icon and styling

2. ✅ Dashboard category cards now pre-select filter on Tickets page
   - Clicking "Expired" card navigates to /tickets?status=expired
   - TicketList reads status query param and applies filter on mount

3. ✅ Renew modal success message shows only after copy
   - "Ticket info ready to paste" appears after clicking Copy Info button
   - Resets when modal reopens for better UX

---

**Instructions:**
1. Add bugs, improvements, or notes as you discover them
2. Use checkboxes [ ] for items to track
3. Be specific and descriptive
4. When ready to implement, run: `@update-orchestrator update 811-ticket-tracker`
