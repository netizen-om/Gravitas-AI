
export async function   GET() {
    return Response.json(
        {success : true, data : "GGs"},
        { status : 200 }
    )
}

export async function POST(req : Request) {
    const { type, role, level, techstack, amount, userid } = await req.json()

    try {
        
    } catch (error) {
        console.error(error)
        return Response.json({success : false, error}, {status:500});
    }
}