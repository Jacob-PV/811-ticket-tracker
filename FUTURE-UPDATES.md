# Future Updates for 811 Ticket Tracker

This file tracks requested updates, bug fixes, and improvements for the 811 Ticket Tracker app.

## Bugs to Fix

---

## Improvements & New Features

---

## General Notes

### Latest Update (v1.2.1) - Date Input Styling Fixes
**Date**: 2025-12-18
**Commits**: 27c27d5, bee8ada

**Issues Fixed**:
1. Date inputs had straight edge on right side due to overflow-hidden clipping rounded-md corners
2. Padding not visually symmetric on left/right sides

**Changes**:
- Input.jsx: Removed overflow-hidden from parent div that was clipping corners
- TicketList.jsx: Removed overflow-hidden wrapper div, added min-h-[48px] and focus styles to match State field
- Input.jsx: Changed from px-* to explicit pl-* pr-* values for guaranteed symmetric padding
- TicketList.jsx: Updated New Expiration Date field to use symmetric padding
- Date inputs now have proper rounded corners and perfectly symmetric padding on all sides

---

**Instructions:**
1. Add bugs, improvements, or notes as you discover them
2. Use checkboxes [ ] for items to track
3. Be specific and descriptive
4. When ready to implement, run: `@update-orchestrator update 811-ticket-tracker`
