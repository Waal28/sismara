import React from "react";

const datas = [
  {
    id: 1,
    title: "Ningkatin Skill",
    description:
      " Dari acara-acara kampus, kamu bisa belajar banyak keterampilan baru, kayak cara berkomunikasi, kepemimpinan, atau bekerja sama dalam tim. Semisal, kamu bisa ikutan workshop atau seminar yang seru.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Relasi",
    description:
      "Acara kampus juga jadi tempat asyik buat kenalan baru. Kamu bisa bertemu dengan mahasiswa lain, dosen, atau bahkan orang-orang dari dunia profesional. Siapa tahu, kamu bisa dapat teman baru atau kesempatan kerja.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Mempererat Ikatan dengan Kampus",
    description:
      "Dengan ikut serta dalam acara-acara kampus, kamu juga turut mempererat hubunganmu dengan kampus. Kamu jadi merasa lebih terhubung dengan teman-teman dan atmosfer kampus.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
    ),
  },
  //   {
  //     id: 4,
  //     title: "Sertifikat",
  //     description:
  //       "Beberapa acara memberikan sertifikat kepada peserta aktif. Ini bisa jadi bukti pengalaman berharga untuk CV atau portofoliomu, serta meningkatkan peluangmu di dunia kerja atau akademis.",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //         strokeWidth={2}
  //         stroke="currentColor"
  //         className="h-7 w-7"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
  //         />
  //       </svg>
  //     ),
  //   },
  //   {
  //     id: 5,
  //     title: "Pemikiran Baru",
  //     description:
  //       "Nonton acara kampus juga bisa bikin pikiranmu terbuka dan tumbuh secara pribadi. Kamu bisa dapet pemikiran baru, atau bahkan menemukan dirimu sendiri.",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //         strokeWidth={2}
  //         stroke="currentColor"
  //         className="h-7 w-7"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
  //         />
  //       </svg>
  //     ),
  //   },
  //   {
  //     id: 6,
  //     title: "Menambah Wawasan",
  //     description:
  //       "Di acara kampus, sering ada pembicara keren atau topik-topik menarik yang gak kamu dapatkan di kelas. Jadi, bisa tambah wawasan dan pengetahuanmu.",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //         strokeWidth={2}
  //         stroke="currentColor"
  //         className="h-7 w-7"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
  //         />
  //       </svg>
  //     ),
  //   },
];
export default function Benefits() {
  return (
    <div className="container -mt-16 pt-36 pb-36 mx-auto px-6">
      {/* Section: Design Block */}
      <section className="text-center">
        <h2 className="mb-6 text-6xl tracking-tight font-extrabold text-center text-teal-900 dark:text-white">
          Benefit
        </h2>
        <p className="mb-12 text-teal-900 dark:text-white">
          Beberapa benefit menarik yang bisa didapat dari mengikuti acara di
          kampus.
        </p>
        <div className="text-center mb-14">
          <span className="inline-block w-1 h-1 rounded-full bg-teal-500 ml-1" />
          <span className="inline-block w-3 h-1 rounded-full bg-teal-500 mx-1" />
          <span className="inline-block w-40 h-1 rounded-full bg-teal-500" />
          <span className="inline-block w-3 h-1 rounded-full bg-teal-500 ml-1" />
          <span className="inline-block w-1 h-1 rounded-full bg-teal-500 ml-1" />
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 justify-center items-center">
          {datas.map((data) => (
            <div className="mb-12 lg:mb-0 shadow-xl h-full" key={data.id}>
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-teal-900">
                <div className="flex justify-center dark:text-white">
                  <div className="-mt-8 inline-block rounded-full bg-teal-600 p-4 shadow-md">
                    {data.icon}
                  </div>
                </div>
                <div className="p-6 dark:text-white">
                  <h5 className="mb-4 text-lg font-semibold">{data.title}</h5>
                  <p>{data.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Section: Design Block */}
    </div>
  );
}
