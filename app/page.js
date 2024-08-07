'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, getDocs, query, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [pantry, setInventory] = useState([]) //state variable to store inventory - default value is an empty array
  const [open, setOpen] = useState([]) //state variables for our bottle, which we're going to use to add and remove stuff - default value is false
  const [itemName, setItemName] = useState('')// state variable to store the item that we type out - default value is an empty string
  
  /*
  fetch inventory from Firebase (async which means that it will not block our code when it is fetching, 
  which is important because if it is blocked, your whole website will freeze when fetching)
  */
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry')) //query from firebase
    const docs = await getDocs(snapshot) //gets the docs from Firebase
    const inventoryList = []
    docs.forEach((doc) => { //for every element in our docs, we want to add it to our inventory list
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList) //sets inventory to inventory list
  }

  //function that adds items
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item) //diff way to get docRef, gets direct item reference
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      //if exists, add 1 to quantity
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    //if it doesn't exist, set quantity to 1
    else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  //function that removes items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item) //diff way to get docRef, gets direct item reference
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      //remove accounts by 1
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef) //if it doesn't exist we do nothing
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1}) // if exists, remove quantity by 1
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, []//dependency array that will dictate if the method is called when something in the dependency array changes. right now threre is nothing in the array so it will run only once when the page loads
  ) 
  //model helper functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  //modal is from Material UI given template for adding 
  return (
    <Box 
      width = "100vw"
      height = "100vh"
      display = "flex"
      flexDirection = "column"
      justifyContent = "center"
      alignItems = "center"
      gap = {2}
    >
      <Modal open = {open} onClose = {handleClose}>
        <Box 
          position = "absolute"
          top = "50%"
          left = "50%"
          width = {400}
          bgcolor = "white"
          border = "2px solid #0001"
          boxShadow = {24}
          p = {4}
          display = "flex"
          flexDirection = "column"
          gap = {3}
          sx = {{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant = "h6">Add Item</Typography>
          <Stack width = "100%" direction = "row" spacing = {2}>
            <TextField 
            variant = 'outlined'
            fullWidth
            value = {itemName}
            onChange = {(e) => {
              setItemName(e.target.value)
            }}
            ></TextField>
            <Button 
              variant = "outlined"
              onClick = {() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant = "contained"
        onClick = {() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <Box border = "1px solid #333">
          <Box 
          width = "800px"
          height = "100px"
          bgcolor = "#ADD8E6"
          display = "flex"
          alignItems = "center"
          justifyContent = "center"
          >
            <Typography variant = "h2" color = "#333" >
              Pantry Items
            </Typography>
          </Box>
      <Stack witdth = "800px" height = "300px" spacing = {2} overflow = "auto">
        {pantry.map(({name, quantity})=> (
          <Box
            key = {name}
            width = "100%"
            minHeight = "150px"
            display = "flex"
            alignItems = "center"
            justifyContent = "space-between"
            bgColor = "#f0f0f0"
            padding = {5}
          >
            <Typography 
              variant = "h3" 
              color = "#333"
              textAlign = "center"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography 
              variant = "h3" 
              color = "#333"
              textAlign = "center"
            >
              {quantity}
            </Typography>
            <Button 
              variant = "contained"
              onClick = {() => {
                removeItem(name)
              }}
            >
              Remove
            </Button>

          </Box>    
          
        ))}
      </Stack>
      </Box>
    </Box>
  )
}
