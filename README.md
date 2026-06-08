# estore-upload-tracker
Tool for someone running an online store to keep track of their file uploads used for their shop.
Etsy Upload Tracker

An automation tool built for an Etsy store owner who needed an easy way to track file uploads across their shop.

The Problem
Managing a growing Etsy store means uploading a lot of files — product
images, digital downloads, and supporting assets. Without a system in
place, it was easy to lose track of what had been uploaded, when it was
added, and any relevant notes about it. This project replaced that
guesswork with an automatic log.

What It Does
Every time a file is uploaded to Etsy, the tracker automatically records:

File name — exactly as uploaded
Date and time — timestamp of the upload
Notes — optional field for context or descriptions
Description — additional detail column if needed
All entries are logged to a live Google Sheet in real time, with additional Notes or Descriptions manual/optional

How It Works
The system has two components:

1. Tampermonkey Userscript (JavaScript)
A browser-based script that detects when a file upload occurs on the
Etsy seller dashboard and captures the relevant file data.

2. Google Apps Script (Web App)
A deployed Google Web App that receives the upload data and writes it
as a new row into a connected Google Sheet, acting as the logging endpoint.

Together, they create an event-driven pipeline:
File uploaded on Etsy → Tampermonkey captures it → Sends to Google Web App → Logged in Google Sheet

Tools Used
JavaScript (Tampermonkey userscript)
Google Apps Script
Google Sheets (as a structured log / lightweight database)
Outcome
The store owner went from losing track of uploads to having a
searchable, sortable, always-current record of every file added to
their shop — updated automatically with zero extra effort on their part.

Notes
This project was built for a specific Etsy seller dashboard layout.
If Etsy updates their UI, the Tampermonkey script may require adjusting.
