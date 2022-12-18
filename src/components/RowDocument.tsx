import { Checkbox, TableCell, TableRow } from "@mui/material"
import { useState } from "react"
import { IDocument } from "./Main"

interface documentProps {
    document: IDocument,
    handleChangeStatus: (id : string, updateStatus : string) => void
}

export const RowDocument = ({document, handleChangeStatus}:documentProps) => {
    const [check, setCheck] = useState<string>('archive');
    const [currentStatus, setCurrentStatus] = useState<string>('');

    const res =  Number(document.sum)*Number(document.qty);
    
    const handleChange = () => {
        if (check === 'archive') {
            setCheck('active');
            setCurrentStatus('active')
        } 
        else {
            setCheck('archive')
            setCurrentStatus('archive')
        }
    }


  return (
    <TableRow key={document.id} >
    <TableCell align="center">
        <Checkbox 
            checked={(document.status === check)}
            onChange={() => {handleChange(); handleChangeStatus(document.id, currentStatus);}}
        />
    </TableCell>
    <TableCell align="center">{document.sum}</TableCell>
    <TableCell align="center">{document.qty}</TableCell>
    <TableCell align="center">{document.volume}</TableCell>
    <TableCell align="center">{document.name}</TableCell>
    <TableCell align="center">{document.delivery_date}</TableCell>
    <TableCell align="center">{document.currency}</TableCell>
    <TableCell align="center">{res}</TableCell>
  </TableRow>
  )
}
