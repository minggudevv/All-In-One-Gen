
const translations = {
  header: {
    identity: "Identitas",
    email: "Email",
    password: "Kata Sandi",
    dashboard: "Dasbor",
    login: "Masuk",
    logout: "Keluar",
    signup: "Daftar",
  },
  home: {
    title: "Generator Lengkap Serba Guna",
    subtitle: "Buat identitas palsu, email sementara, dan kata sandi yang kuat dalam hitungan detik. Solusi lengkap untuk semua kebutuhan pembuatan data Anda.",
    getStarted: "Mulai",
    identityGenerator: "Generator Identitas",
    identityGeneratorDesc: "Buat identitas palsu yang realistis lengkap dengan nama, alamat, dan foto.",
    emailGenerator: "Generator Email",
    emailGeneratorDesc: "Hasilkan alamat email sementara dan sekali pakai secara instan.",
    passwordGenerator: "Generator Kata Sandi",
    passwordGeneratorDesc: "Hasilkan kata sandi yang kuat, aman, dan acak untuk melindungi akun Anda.",
    credentialManager: "Manajer Kredensial",
    credentialManagerDesc: "Simpan dan kelola login dan kata sandi penting Anda dengan aman menggunakan enkripsi sisi klien.",
    tryNow: "Coba sekarang",
  },
  identity: {
    title: "Generator Identitas Palsu",
    subtitle: "Hasilkan identitas acak yang lengkap dengan sekali klik.",
    details: {
      title: "Detail",
      fullName: "Nama Lengkap",
      email: "Alamat Email",
      phone: "Nomor Telepon",
      address: "Alamat",
      dob: "Tanggal Lahir",
      backstory: "Cerita Latar Buatan AI",
    },
    buttons: {
        correctMap: "Perbaiki Lokasi Peta",
        correctingMap: "Memperbaiki...",
        generate: "Buat Cerita Latar",
        generating: "Membuat...",
        copyBackstory: "Salin Cerita Latar",
        generateAgain: "Buat Lagi",
        save: "Simpan ke Dasbor",
        saving: "Menyimpan...",
        loginToSave: "Masuk untuk Menyimpan",
    },
    loginPrompt: {
        login: "Masuk",
        map: "untuk peta yang lebih akurat.",
        backstory: "untuk membuat cerita latar.",
    }
  },
  email: {
    title: "Generator Email Palsu",
    subtitle: "Hasilkan alamat email acak sekali pakai secara instan.",
    cardTitle: "Email yang Dihasilkan",
    regenerate: "Buat Ulang",
    saveEmail: "Simpan email",
    copyEmail: "Salin email",
    loginPrompt: {
      login: "Masuk",
      message: "untuk menyimpan email ke dasbor Anda.",
    },
  },
  password: {
    title: "Generator Kata Sandi",
    subtitle: "Buat kata sandi yang kuat, aman, dan acak untuk melindungi akun Anda.",
    ariaLabel: "Kata Sandi yang Dihasilkan",
    strength: {
      weak: "Lemah",
      medium: "Sedang",
      strong: "Kuat",
    },
    options: {
      length: "Panjang Kata Sandi",
      uppercase: "Huruf Besar (A-Z)",
      numbers: "Angka (0-9)",
      symbols: "Simbol (!@#)",
    },
    buttons: {
      generate: "Buat Kata Sandi Baru",
      save: "Simpan ke Dasbor",
      saving: "Menyimpan...",
      loginToSave: "Masuk untuk Menyimpan",
    },
  },
  dashboard: {
      title: "Dasbor",
      subtitle: "Kelola identitas, email, dan kata sandi Anda yang tersimpan di sini.",
      noResults: "Tidak ada hasil.",
      tabs: {
          identities: "Identitas",
          emails: "Email",
          passwords: "Kata Sandi"
      },
      buttons: {
          addIdentity: "Identitas",
          addEmail: "Email",
          addPassword: "Kata Sandi",
      },
      filter: {
          name: "Filter berdasarkan nama...",
          email: "Filter berdasarkan email...",
          password: "Filter berdasarkan kata sandi...",
      },
      empty: {
          identities: {
              title: "Belum Ada Identitas Tersimpan",
              description: "Anda belum menyimpan identitas apa pun. Mulailah dengan membuatnya!",
              cta: "Buat Identitas",
          },
          emails: {
              title: "Belum Ada Email Tersimpan",
              description: "Anda belum menyimpan email apa pun. Mulailah dengan membuatnya!",
              cta: "Buat Email",
          },
          passwords: {
                title: "Belum Ada Kata Sandi Tersimpan",
                description: "Anda belum menyimpan kata sandi apa pun. Mulailah dengan membuatnya!",
                cta: "Buat Kata Sandi",
          }
      },
      columns: {
          name: "Nama",
          email: "Email",
          phone: "Telepon",
          location: "Lokasi",
          password: "Kata Sandi",
          strength: "Kekuatan",
          savedOn: "Disimpan pada",
          justNow: "Baru saja",
      },
      actions: {
            title: "Aksi",
            view: "Lihat di Web",
            correctLocation: "Perbaiki Lokasi",
            copyJson: "Salin JSON",
            copyEmail: "Salin Email",
            copyPhone: "Salin Telepon",
            copyPassword: "Salin Kata Sandi",
            delete: "Hapus",
      },
      deleteDialog: {
          title: "Apakah Anda benar-benar yakin?",
          description: "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item yang disimpan ini secara permanen dari server kami.",
          cancel: "Batal",
          confirm: "Hapus",
      }
  },
  identityView: {
    subtitle: "Profil Identitas Digital",
    notFound: {
        title: "Identitas Tidak Ditemukan",
        description: "Identitas yang Anda cari tidak dapat ditemukan. Silakan kembali ke generator dan buat yang baru.",
    },
    cards: {
        personal: {
            title: "Info Pribadi",
            age: "Usia",
            birthday: "Ulang Tahun",
            nationality: "Kewarganegaraan",
        },
        contact: {
            title: "Detail Kontak",
            email: "Alamat Email",
            phone: "Nomor Telepon",
        },
        location: {
            title: "Lokasi",
            address: "Alamat Lengkap",
        },
        backstory: {
            title: "Cerita Latar Buatan AI",
        }
    }
  },
  login: {
      title: "Selamat Datang Kembali!",
      subtitle: "Masukkan kredensial Anda untuk mengakses akun Anda.",
      form: {
          email: "Email",
          password: "Kata Sandi",
      },
      buttons: {
          loggingIn: "Sedang masuk...",
          logIn: "Masuk",
      },
      signupPrompt: {
          message: "Belum punya akun?",
          link: "Daftar"
      }
  },
  signup: {
    title: "Buat Akun",
    subtitle: "Mulai hasilkan data dalam hitungan detik. Gratis!",
    form: {
        email: "Email",
        username: "Nama Pengguna",
        password: "Kata Sandi",
        confirmPassword: "Konfirmasi Kata Sandi",
        terms: {
            start: "Saya setuju dengan",
            termsLink: "Ketentuan Layanan",
            and: "dan",
            privacyLink: "Kebijakan Privasi",
            description: "Anda harus menyetujui persyaratan untuk membuat akun."
        }
    },
    buttons: {
        creating: "Membuat akun...",
        signup: "Daftar",
    },
    loginPrompt: {
        message: "Sudah punya akun?",
        link: "Masuk",
    }
  },
  map: {
      loading: "Memuat peta...",
      popup: "Perkiraan lokasi.",
      enlarge: "Perbesar Peta",
      enlargedTitle: "Peta Diperbesar",
  },
  toasts: {
    success: "Sukses!",
    error: "Galat",
    copied: "Tersalin!",
    logoutSuccess: {
        title: "Berhasil Keluar",
        description: "Anda telah berhasil keluar."
    },
    logoutFailed: {
        title: "Gagal Keluar",
        description: "Terjadi galat saat mencoba keluar."
    },
    loginSuccess: {
        title: "Berhasil Masuk",
        description: "Selamat datang kembali!",
    },
    loginFailed: {
        title: "Gagal Masuk",
        description: "Terjadi galat. Silakan coba lagi."
    },
    signupSuccess: {
        title: "Akun Dibuat",
        description: "Anda telah berhasil mendaftar."
    },
    signupFailed: {
        title: "Gagal Mendaftar",
        description: "Terjadi galat. Silakan coba lagi."
    },
    identity: {
        locationErrorTitle: "Tidak dapat menemukan lokasi di darat",
        locationErrorDesc: "Identitas yang dibuat berada di dalam air. Anda dapat mencoba memperbaikinya dengan AI.",
        fetchErrorTitle: "Galat Mengambil Identitas",
        fetchErrorDesc: "Tidak dapat mengambil identitas baru. Silakan periksa koneksi Anda dan coba lagi.",
        backstoryError: "Gagal membuat cerita latar.",
        backstoryCopied: "Cerita latar telah disalin ke papan klip Anda.",
        correctLocationSuccess: "Lokasi peta telah diperbaiki oleh AI.",
        correctLocationError: "Gagal memperbaiki lokasi peta.",
        saveSuccess: "Identitas disimpan ke dasbor Anda.",
        saveError: "Gagal menyimpan identitas. Silakan coba lagi.",
    },
    email: {
        copiedDesc: "telah disalin ke papan klip Anda.",
        saveSuccessDesc: "disimpan ke dasbor Anda.",
        saveErrorDesc: "Gagal menyimpan email. Silakan coba lagi.",
    },
    password: {
        copiedDesc: "Kata sandi telah disalin ke papan klip Anda.",
        saveSuccess: "Kata sandi disimpan ke dasbor Anda.",
        saveError: "Gagal menyimpan kata sandi. Silakan coba lagi.",
    },
    dashboard: {
        fetchIdentitiesError: "Tidak dapat mengambil identitas yang disimpan.",
        fetchEmailsError: "Tidak dapat mengambil email yang disimpan.",
        fetchPasswordsError: "Tidak dapat mengambil kata sandi yang disimpan.",
        deleteSuccess: "Item berhasil dihapus.",
        deleteError: "Gagal menghapus item.",
        copiedDesc: "disalin ke papan klip.",
        correctingLocationTitle: "Memperbaiki Lokasi...",
        correctingLocationDesc: "AI sedang bekerja untuk menemukan koordinat yang benar.",
        correctLocationSuccess: "Lokasi peta telah diperbaiki dan disimpan.",
        correctLocationError: "Gagal memperbaiki lokasi peta.",
    }
  }
};

export default translations;
