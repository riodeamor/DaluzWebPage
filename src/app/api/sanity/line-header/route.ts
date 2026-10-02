import {NextResponse} from "next/server"; import {getLineHeader} from "@/lib/sanity/navigation-headers";
export async function GET(request:Request){const id=new URL(request.url).searchParams.get("id");if(!id||!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:"ID inválido"},{status:400});return NextResponse.json({settings:await getLineHeader(id)},{headers:{"Cache-Control":"no-store"}})}
