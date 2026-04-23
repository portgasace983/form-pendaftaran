import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Button,
  VStack,
  Alert,
  Text
} from "@chakra-ui/react";

import { db } from "../firebase";
import "../css/formpendaftaran.css";

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

import bg from "../assets/bgdesk.jpg";

function App() {
  const [form, setForm] = useState({
    nama: "",
    domisili: "",
    tiktok: "",
    usia: "",
    english: "",
    pengalaman: "",
    mengetik: "",
    wa: ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(1);

  /* 🔥 AUTO HILANG ALERT */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "datapendaftaran"));
      setCounter(snap.size + 1);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setError(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((val) => val === "")) {
      setError(true);
      return;
    }

    try {
      await addDoc(collection(db, "datapendaftaran"), {
        ...form,
        noRegistrasi: `R-${counter.toString().padStart(4, "0")}`,
        timestamp: serverTimestamp()
      });

      setSuccess(true);

      setForm({
        nama: "",
        domisili: "",
        tiktok: "",
        usia: "",
        english: "",
        pengalaman: "",
        mengetik: "",
        wa: ""
      });

    } catch {
      setError(true);
    }
  };

  const inputStyle = {
    bg: "whiteAlpha.200",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    _focus: {
      bg: "white",
      color: "black"
    }
  };

  return (
    <Box
      className="form-wrapper"
      bgImage={{ base: "none", md: `url(${bg})` }}
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
    >
      <Box
        className="form-container"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        px={4}
      >
        <Box
          w="100%"
          maxW="360px"
          p={6}
          borderRadius="2xl"
          bg="rgba(0,0,0,0.6)"
          border="1px solid rgba(255,255,255,0.1)"
        >
          <Text fontSize="xl" color="white" mb={4} textAlign="center">
            Form Pendaftaran Creator 🎥
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>

              <Input
                name="nama"
                placeholder="Nama Lengkap"
                value={form.nama}
                {...inputStyle}
                onChange={handleChange}
              />

              <Input
                name="domisili"
                placeholder="Domisili"
                value={form.domisili}
                {...inputStyle}
                onChange={handleChange}
              />

              <Input
                name="tiktok"
                placeholder="ID TikTok"
                value={form.tiktok}
                {...inputStyle}
                onChange={handleChange}
              />

              <Input
                name="usia"
                type="number"
                placeholder="Usia"
                value={form.usia}
                {...inputStyle}
                onChange={handleChange}
              />

              <Select
                name="english"
                value={form.english}
                {...inputStyle}
                onChange={handleChange}
              >
                <option value="">Bahasa Inggris Basic</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </Select>

              <Select
                name="pengalaman"
                value={form.pengalaman}
                {...inputStyle}
                onChange={handleChange}
              >
                <option value="">Pengalaman Live</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </Select>

              <Select
                name="mengetik"
                value={form.mengetik}
                {...inputStyle}
                onChange={handleChange}
              >
                <option value="">Kemampuan Mengetik</option>
                <option value="Lancar">Lancar</option>
                <option value="Tidak">Tidak</option>
              </Select>

              <Input
                name="wa"
                placeholder="No WhatsApp"
                value={form.wa}
                {...inputStyle}
                onChange={handleChange}
              />

              {/* 🔥 BUTTON KECIL */}
              <Button
                type="submit"
                colorScheme="blue"
                w="40%"
                mx="auto"
                display="block"
                borderRadius="full"
                _hover={{ transform: "scale(1.05)" }}
              >
                Daftar
              </Button>

            </VStack>
          </form>

          {/* 🔥 ALERT AUTO HILANG */}
          {success && (
            <Alert status="success" mt={4} borderRadius="lg">
              Berhasil daftar!
            </Alert>
          )}

          {error && (
            <Alert status="error" mt={4} borderRadius="lg">
              Semua field wajib diisi!
            </Alert>
          )}

        </Box>
      </Box>
    </Box>
  );
}

export default App;