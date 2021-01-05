/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPool() {
    const classes = useStyles();

    return (
        <Grid item xs={12} container style={{marginBottom: "24px"}} spacing={0}>
        <div style={{width: "100%"}}>
            <Accordion
                expanded={Boolean(openedCardList.includes(index))}
                className={classes.accordion}
                TransitionProps={{ unmountOnExit: true }}
            >
  <AccordionDetails style={{ justifyContent: "space-between"}}>
  </AccordionDetails>
</Accordion>
</div>
</Grid>
    )
}
