import serverResponse from "@/utils/serverResponse";

export async function GET() {
    return serverResponse({
        success: true,
        message: "Berhasil mendapatkan data pertanyaan Kating",
        data:[
                {
                    "id": 1,
                    "question": "Kiat untuk mengatur waktu dalam perkuliahan dan motivasi untuk tetap semangat kuliah",
                    "group_id": 1
                },
                {
                    "id": 2,
                    "question": "Kesan pertama berkuliah di UI",
                    "group_id": 1
                },
                {
                    "id": 3,
                    "question": "Tips and trick belajar dan rekomendasi organisasi dan UKM di UI",
                    "group_id": 1
                },
                {
                    "id": 4,
                    "question": "Rekomendasi makanan di UI",
                    "group_id": 1
                },
                {
                    "id": 5,
                    "question": "Apa pendapat Ko/Ci tentang KMBUI, pengalaman di KMBUI",
                    "group_id": 1
                },
                {
                    "id": 6,
                    "question": "Tempat nongkrong / belajar di dalam UI dan sekitar UI",
                    "group_id": 1
                },
                {
                    "id": 7,
                    "question": "Hobi dan kegiatan saat luang di UI",
                    "group_id": 1
                }
            ]
        } 
    );
}