import { Box, Table, TableCell, TableHead, TableRow, TableBody, Checkbox, Typography, FormControlLabel, TextField, InputAdornment, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from "@mui/material"
import { useEffect, useState } from "react";
import { RowDocument } from "./RowDocument";
import SearchIcon from '@mui/icons-material/Search';

export interface IDocument {
  id: string,
  status: string,
  sum: number,
  qty: number,
  volume: number,
  name: string,
  delivery_date: string,
  currency: number
}

export const Main = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<any>('');
  const [documentsSorted, setDocumentsSorted] = useState<IDocument[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [archive, setArchive] = useState<String[]>([]);
  const [keys, setKeys] = useState<String[]>([])
  

  const fetchData= async (url:string) => {
    try {
      let response = await fetch(url);
      let data = await response.json();
      setDocuments(prev => [...prev, ...data]);
    } catch(error) {
      alert(error);
    }
  }

  const fetchAll = () => {
    fetchData ('http://localhost:3000/documents1');
    fetchData ('http://localhost:3000/documents2');    
  }

  useEffect(() => {
    fetchAll();
  },[])

  useEffect(() => {
    setDocumentsSorted(documents);
  },[documents])

  // реализация выбора всех checkbox
  const checkboxHandleChange = () => {
    if (checkedAll) { 
      setCheckedAll(false);
      documentsSorted.map ((document: IDocument) => (
        document.status = 'active'
      ))
    } else {
      setCheckedAll(true);
      documentsSorted.map ((document: IDocument) => (
        document.status = 'archive'
      ))
    }
  }
  
  // реализация поиска по таблице
  const inputHandleChange = (e:any) => {
    setInputSearch(e.target.value)
  }

  useEffect(() => {
    const dataSearch: IDocument[] = documents.filter((document : IDocument) => {
      const a = Object.values(document).find(value => value.includes(inputSearch));
      return !!a;
    });
    setDocumentsSorted(dataSearch);
  }, [inputSearch])

  // реализация функции подсчета общего количества
  const getTotal = (a : any) => {
    let volumeArray : string[]= [];

    documentsSorted.forEach((document : any) => {
      const param = String(document[a]).split(" ")
      volumeArray.push(...param)
    })
    let volumeNumbers = volumeArray.map(i => Number(i));
    let total = 1;
    for (let i = 0; i < volumeNumbers.length; i++) {
      total += volumeNumbers[i]
    }
    return total;
  } 

  const handleChangeStatus = (id : string, updateStatus : string) => {
    // eslint-disable-next-line array-callback-return
    documentsSorted.forEach((document : IDocument) => {
      if (document.id === id) {
        return {...document, status : updateStatus}
      } 
    })
  }


  const totalVolume = getTotal('volume');
  const totalQty = getTotal('qty');

  // Диалоговое окно
  const handleClick = () => {
    setOpen(prev => !prev);
  }
  const handleClickClose = () => {
    setOpen(false);
  }

 
  // Добавление в архив
  useEffect (() => {
    let allChecked : string[] = [];

    documentsSorted.forEach((document : IDocument) => {
      if (document.status.includes('archive')) {
        const archive : any = document.name.split(" ")
        const key = document.id.split(" ")
        keys.push(...key)
        allChecked.push(...archive)
      }})
    setKeys(keys)
    setArchive(allChecked)

  }, [documentsSorted]);

  const handleSubmit = async() => {
    let response = await fetch( 'http://localhost:3000/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(keys)
    })
    let result = await response.json();
    return result;
  }

  return (
    <Box component='main' minHeight='86vh' >
      <Box 
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '40ch' },
          display: 'flex',
          justifyContent: 'center',
          margin: '20px auto'
        }}
        noValidate
        autoComplete="off">
          <TextField 
            id="standard-basic" 
            label="Search..." 
            variant="standard" 
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            value={inputSearch}
            onChange={inputHandleChange}
            />
        </Box>

      <Table sx={{ maxWidth: '90vw', margin: '20px auto' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Typography>status</Typography>
            <FormControlLabel 
              control={<Checkbox 
                checked={(checkedAll === true)} 
                onChange={checkboxHandleChange}
                />} 
              label='all' />
            </TableCell>
            <TableCell align="center">sum</TableCell>
            <TableCell align="center">qty</TableCell>
            <TableCell align="center">volume</TableCell>
            <TableCell align="center">name</TableCell>
            <TableCell align="center">dalivery_date</TableCell>
            <TableCell align="center">currency</TableCell>
            <TableCell align="center">total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            documentsSorted 
              .sort((a : IDocument ,b : IDocument ) => 
              Date.parse(a.delivery_date) - Date.parse(b.delivery_date)
            )
            .map((document: IDocument) => (
              <RowDocument 
                key={document.id}
                document={document}
                handleChangeStatus = {handleChangeStatus}
              />))
          }
        </TableBody>
      </Table>

      <Box component='footer' sx={{
        display: 'flex',
        height: '7vh',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#e9e9e9'
      }}>
        <Typography>
            Общий объем: {totalVolume}
        </Typography>
        <Typography>
            Общее количество: {totalQty}
        </Typography>
        <Button variant="contained" onClick={handleClick}>
          Аннулировать
        </Button>

        
    </Box>
    {/* Диалоговое окно */}
        <Dialog
        open={open}
        onClose={handleClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Вы уверены что хотите аннулировать товар(ы):</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              archive.map((value) => (
                <p>{value}</p>))
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">Отменить</Button>
          <Button  color="primary" autoFocus onSubmit={handleSubmit}> Применить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
