import React from "react";
import {Drawer, List, ListItem} from '@mui/material';
import {scroller} from 'react-scroll';

const Drawer = (props) => {

    const list_of_itms = [
        {where: 'tourism_images',  value:'Move to top'},
        {where: 'Dates_office',  value:'Date & Office'},
        {where: 'details',  value:'details'},
        {where: 'pricing',  value:'Pricing'},
        {where: 'location',  value:'Location'},

    ]

    const scrollto = (element) =>{
        scroller.scrollTo(element,{
            duration:1500,
            delay:150,
            smooth:true,
            offset:-100
        });
        props.onClose(false)
    }

    const showItems = (item) => {

        return(

            <ListItem button onClick={()=>scrollto(item.where)} key = {item.where}>
                    {item.value}
                </ListItem>
        )
    }
    return(

        <Drawer anchor="right" open={props.open} onClose = {() => props.onClose(false)}>
            <List component= 'nav'>

                {list_of_itms.map((items)=>showItems(items))}
                
            </List>
        
        </Drawer>
    )
}

export default Drawer;