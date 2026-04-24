import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Text,
  Flex
} from "@chakra-ui/react";

import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

import { signOut } from "firebase/auth";
import bg from "../assets/bgdesk.jpg";

import { saveAs } from "file-saver";
import Papa from "papaparse";

const Admin = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // 📌 FETCH DATA
  const fetchData = async () => {
    const q = query(collection(db, "datapendaftaran"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // 📌 DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus?")) {
      await deleteDoc(doc(db, "datapendaftaran", id));
      fetchData();
    }
  };

  // 📌 VIEW DETAIL
  const handleView = async (id) => {
    const snap = await getDoc(doc(db, "datapendaftaran", id));
    setEditData({ id: snap.id, ...snap.data() });
    setIsOpen(true);
  };

  // 📌 UPDATE DATA
  const handleUpdate = async () => {
    const { id, ...rest } = editData;
    await updateDoc(doc(db, "datapendaftaran", id), rest);
    setIsEdit(false);
    setIsOpen(false);
    fetchData();
  };

  // 📌 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🚀 EXPORT FIX FINAL
  const exportExcel = () => {
    let filtered = [...data];

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = data.filter((item) => {
        if (!item.timestamp) return false;

        let time;
        try {
          time = item.timestamp.toDate();
        } catch {
          time = new Date(item.timestamp);
        }

        if (!time || isNaN(time.getTime())) return false;

        return time >= start && time <= end;
      });
    }

    const csv = Papa.unparse(
      filtered.map((item, i) => ({
        No: i + 1,
        Nama: item.nama || "",
        Domisili: item.domisili || "",
        TikTok: item.tiktok || "",
        Usia: item.usia || "",
        English: item.english || "",
        Pengalaman: item.pengalaman || "",
        Mengetik: item.mengetik || "",
        WA: item.wa || "",
        NoRegistrasi: item.noRegistrasi || "",
        Tanggal: item.timestamp?.toDate?.().toISOString() || ""
      }))
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    saveAs(blob, "DATA_EXPORT.csv");
    setShowExport(false);
  };

  return (
    <Box bgImage={`url(${bg})`} bgSize="cover" minH="100vh" position="relative">

      <Box position="absolute" w="100%" h="100%" bg="rgba(0,0,0,0.7)" />

      <Box position="relative" zIndex="2" p={6}>

        {/* HEADER */}
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" color="white">
            Dashboard Admin 📊
          </Text>

          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>

        {/* TABLE FULL LENGKAP (KEMBALI SEPERTI AWAL) */}
        <Box bg="rgba(255,255,255,0.05)" p={4} borderRadius="xl" overflowX="auto">

          <Table variant="simple" colorScheme="whiteAlpha" minW="1200px">

            <Thead>
              <Tr>
                <Th color="white">No</Th>
                <Th color="white">Nama</Th>
                <Th color="white">Domisili</Th>
                <Th color="white">TikTok</Th>
                <Th color="white">Usia</Th>
                <Th color="white">English</Th>
                <Th color="white">Pengalaman</Th>
                <Th color="white">Mengetik</Th>
                <Th color="white">WA</Th>
                <Th color="white">Aksi</Th>
              </Tr>
            </Thead>

            <Tbody>
              {data.map((item, i) => (
                <Tr key={item.id}>
                  <Td color="white">{i + 1}</Td>
                  <Td color="white">{item.nama}</Td>
                  <Td color="white">{item.domisili}</Td>
                  <Td color="white">{item.tiktok}</Td>
                  <Td color="white">{item.usia}</Td>
                  <Td color="white">{item.english}</Td>
                  <Td color="white">{item.pengalaman}</Td>
                  <Td color="white">{item.mengetik}</Td>
                  <Td color="white">{item.wa}</Td>

                  <Td>
                    <Button size="sm" mr={2} onClick={() => handleView(item.id)}>
                      Lihat
                    </Button>

                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(item.id)}>
                      Hapus
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>

          </Table>

        </Box>

        {/* EXPORT BUTTON */}
        <Box position="fixed" bottom="20px" right="20px">
          <Button
            colorScheme="green"
            size="lg"
            borderRadius="full"
            onClick={() => setShowExport(true)}
          >
            Download Excel
          </Button>
        </Box>

      </Box>

      {/* DETAIL MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Detail Data</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {Object.keys(editData).map((key) =>
              key !== "id" && key !== "timestamp" ? (
                <Box key={key} mb={3}>
                  <Text fontSize="sm" color="gray.400">{key}</Text>

                  {isEdit ? (
                    <Input
                      value={editData[key] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{editData[key]}</Text>
                  )}
                </Box>
              ) : null
            )}
          </ModalBody>

          <ModalFooter>
            {isEdit ? (
              <>
                <Button colorScheme="green" onClick={handleUpdate}>
                  Simpan
                </Button>
                <Button ml={2} onClick={() => setIsEdit(false)}>
                  Batal
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEdit(true)}>Edit</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EXPORT MODAL */}
      <Modal isOpen={showExport} onClose={() => setShowExport(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pilih Tanggal Export</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text mb={2}>Tanggal Awal</Text>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <Text mt={3} mb={2}>Tanggal Akhir</Text>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={exportExcel}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default Admin;