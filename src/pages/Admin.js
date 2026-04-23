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

const Admin = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(collection(db, "datapendaftaran"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus?")) {
      await deleteDoc(doc(db, "datapendaftaran", id));
      fetchData();
    }
  };

  const handleView = async (id) => {
    const snap = await getDoc(doc(db, "datapendaftaran", id));
    const result = { id: snap.id, ...snap.data() };
    setEditData(result);
    setIsEdit(false);
    setIsOpen(true);
  };

  const handleUpdate = async () => {
    const { id, ...rest } = editData;
    await updateDoc(doc(db, "datapendaftaran", id), rest);
    setIsEdit(false);
    setIsOpen(false);
    fetchData();
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const inputStyle = {
    bg: "whiteAlpha.200",
    color: "white",
    _focus: { bg: "white", color: "black" }
  };

  return (
    <Box
      bgImage={`url(${bg})`}
      bgSize="cover"
      minH="100vh"
      position="relative"
    >
      <Box
        position="absolute"
        w="100%"
        h="100%"
        bg="rgba(0,0,0,0.7)"
        zIndex="1"
      />

      <Box position="relative" zIndex="2" p={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" color="white">
            Dashboard Admin 📊
          </Text>

          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>

        <Box
          bg="rgba(255,255,255,0.05)"
          backdropFilter="blur(10px)"
          p={4}
          borderRadius="xl"
          overflowX="auto"
        >
          <Table variant="simple" colorScheme="whiteAlpha" minW="900px">
            <Thead>
              <Tr>
                <Th color="white">No</Th>
                <Th color="white">Nama</Th>
                <Th color="white">Domisili</Th>
                <Th color="white">TikTok</Th>
                <Th color="white">Usia</Th>
                <Th color="white">English</Th>
                <Th color="white">Live</Th>
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

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />

        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Detail Data</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {Object.keys(editData).map((key) =>
              key !== "id" && key !== "timestamp" ? (
                <Box key={key} mb={3}>
                  <Text fontSize="sm" color="gray.400">
                    {key}
                  </Text>

                  {isEdit ? (
                    <Input
                      {...inputStyle}
                      value={editData[key] || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [key]: e.target.value
                        })
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
              <>
                <Button onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                <Button ml={2} onClick={() => window.print()}>
                  Print
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Admin;