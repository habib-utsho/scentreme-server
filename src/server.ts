import { prisma } from "./lib/prisma"




const main = async () => {
    const user = await prisma.user.findMany()
    console.log(user)
}
main()