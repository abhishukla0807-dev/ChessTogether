export const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxKL-v0-ezOrjg4LCoaa82qssGTkkcO0k6aTBjr7Ur0v0JQy9xDfnGr_lMHxn7x-4PK/exec";

export const GOOGLE_SHEET_VIEW_URL =
  "https://docs.google.com/spreadsheets/d/11Xo4tRH7MBWZXmGRJOdpbMPprbZ8XfEAbrO76NOwSUg/edit?usp=sharing";

export interface JobApplicationLead {
  name: string;
  email: string;
  phone?: string;
  jobId?: string | number;
  jobTitle?: string;
  company?: string;
  salary?: string;
}

export async function submitLeadToGoogleSheet(lead: JobApplicationLead): Promise<boolean> {
  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(lead),
    });
    return true;
  } catch (error) {
    console.error("Failed to submit lead to Google Sheet:", error);
    return false;
  }
}
