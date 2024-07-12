

// Helper function to parse JSON bodies
const getRawBody = async (req) => {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
};

export async function POST(req, res) {

    console.log(await getRawBody(req))
    // GOOGLEAI key
  const googleAPIkey = process.env.GOOGLEAI_API_KEY;

  return NextResponse.json({message: "Done", data: {txt: req.body}}, { status: 200});

}