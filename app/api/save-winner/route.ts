import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SHEET_ID = '1_K7zvQ8SF18WvC-WMZTa8MHXPPchnWT0WHCQ5gtTlP4';
const SHEET_RANGE = 'Sheet1!A1:C1'; // Adjust as needed

// Load credentials from JSON file
const credentialsPath = path.join(process.cwd(), 'app/api/save-winner/credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

export async function POST(req: NextRequest) {
  try {
    const { prize, name, phone } = await req.json();

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[prize, name, phone]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving winner:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
