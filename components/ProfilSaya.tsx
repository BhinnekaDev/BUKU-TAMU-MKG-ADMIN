export default function ProfilSaya() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-700">Informasi Akun</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-600">Nama</label>
          <input
            type="text"
            value="Admin User"
            className="mt-1 w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            readOnly
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value="admin@bmkg.go.id"
            className="mt-1 w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            readOnly
          />
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-xl font-bold text-gray-700">Ubah Kata Sandi</h3>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="text-sm text-gray-600">Kata Sandi Baru</label>
            <input
              type="password"
              placeholder="********"
              className="mt-1 w-full border rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Konfirmasi Sandi</label>
            <input
              type="password"
              placeholder="********"
              className="mt-1 w-full border rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
