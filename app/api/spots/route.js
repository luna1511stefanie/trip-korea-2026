import { google } from 'googleapis';

export async function GET() {
  try {
    const sheetId = (process.env.SHEET_ID || '').trim();
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Read data from the "Travel Spot Data" tab
    // Headers are in row 2, data starts from row 3, columns B through O
    const range = 'Travel Spot Data!B2:O';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length < 2) {
      return Response.json([]);
    }

    // First row contains headers, skip it and process data rows
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Map column indices to property names
    // B: Name, C: Type, D: Area, E: Photo URL, F: Description, G: Opening Hours, 
    // H: Rating, I: Reservation Link, J: Menu Link, K: Naver Map Link, 
    // L: In Itinerary?, M: Day, N: Remarks, O: Cost (SGD)
    const spots = dataRows.map(row => {
      return {
        name: (row[0] || '').trim(),
        type: (row[1] || '').trim(),
        area: (row[2] || '').trim(),
        photoUrl: (row[3] || '').trim(),
        description: (row[4] || '').trim(),
        openingHours: (row[5] || '').trim(),
        rating: (row[6] || '').trim(),
        reservationLink: (row[7] || '').trim(),
        menuLink: (row[8] || '').trim(),
        naverMapLink: (row[9] || '').trim(),
        inItinerary: (row[10] || '').trim(),
        day: (row[11] || '').trim(),
        remarks: (row[12] || '').trim(),
        cost: (row[13] || '').trim()
      };
    }).filter(spot => spot.name !== ''); // Filter out empty rows

    // Set cache headers (5 minutes)
    return Response.json(spots, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error fetching spots:', error.message);
    return Response.json(
      { error: 'Failed to fetch travel spots' }, 
      { status: 500 }
    );
  }
}