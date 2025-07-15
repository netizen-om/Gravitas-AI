import { getCurrentUser } from "@/lib/auth";

export async function GET () {
    const user = await getCurrentUser();
    console.log(user);
    
    return Response.json({user, status : 200} );
}