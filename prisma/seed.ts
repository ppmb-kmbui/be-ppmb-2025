import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function main() {
    await prisma.$connect;
    await prisma.question.createMany({
        data: [
            {
                question: "Jalur masuk UI serta alasan mengambil jurusan tersebut",
                group_id: 1
            },
            {
                question: "Suasana hati setelah dinyatakan diterima di UI beserta impian/persiapan akademik kedepannya",
                group_id: 1
            },
        ],
        skipDuplicates: true,
    });

    await prisma.question.createMany({
        data: [
            {
                question: "Kegiatan apa yang ingin kamu coba selama kuliah untuk menemukan minat dan tujuan baru",
                group_id: 2
            },
            {
                question: "Apa satu kebiasaan kecil yang ingin kamu tingkatkan selama kuliah?",
                group_id: 2
            },
            {
                question: "Kalau kamu bisa punya superpower, apa yang kamu pilih dan bagaimana kamu akan menggunakannya untuk membantu orang lain",
                group_id: 2
            },
            {
                question: "Apa cita-cita atau impianmu, dan kenapa memilih itu",
                group_id: 2
            },
            {
                question: "Pengalaman yang paling seru dan mengesankan selama SMA",
                group_id: 2
            },
            {
                question: "Kalau ada pintu doraemon kemana saja, kamu mau pergi kemana dan kenapa",
                group_id: 2
            },
            {
                question: "Area atau tempat  di UI mana yang pernah kamu didatangi atau ingin didatangi",
                group_id: 2
            },
            {
                question: "Kalau kamu bisa jadi karakter di film atau buku, kamu mau jadi siapa dan alasannya apa",
                group_id: 2
            },
            {
                question: "Siapa role model-mu dan apa hal yang paling kalian suka dari dia",
                group_id: 2
            },
            {
                question: "Musik yang paling membantu dirimu untuk moodbooster",
                group_id: 2
            },
            {
                question: "Makanan dan minuman yang paling tidak kamu suka dan alasannya",
                group_id: 2
            },
        ],
        skipDuplicates: true,
    });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })