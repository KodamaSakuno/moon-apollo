/* eslint-disable */
import React, { useState, useEffect, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'
import classNames from "classnames";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import {primaryColor} from "assets/jss/material-kit-pro-react.js";
// core components
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CustomInput from "components/CustomInput/CustomInput.js";
import SectionPoolsCard from './SectionPoolsCard';
// sections for this section
// import SectionOpenedPool from "./SectionOpenedPool";
import { useSnackbar } from 'notistack';
//  hooks
import { useConnectWallet } from '../../home/redux/hooks';
import { useFetchPoolsInfo, useFetchBalance, useFetchBalances } from '../redux/hooks';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import { isEmpty } from 'features/helpers/utils';
import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";
import { useFetchPoolBalances } from '../../vault/redux/hooks';
import PoolHeader from '../../vault/sections/PoolHeader'
import PoolContent from '../../vault/sections/PoolContent';

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { t, i18n } = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  const { pools, poolsInfo, fetchPoolsInfo } = useFetchPoolsInfo(networkId);
  const { pools: vaultPools } = useFetchPoolBalances();
  const { etherBalance, fetchBalance } = useFetchBalance();
  const { erc20Tokens, fetchBalances } = useFetchBalances();
  const [ cardIsOpenedList, setCardIsOpenedList ] = useState(Array(pools.length).fill(false));
  const [ openedCardList, setOpenCardList ] = useState([0]);
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (address && web3) {
      fetchPoolsInfo()
      fetchBalance();
      fetchBalances();
      const id = setInterval(() => {
        fetchPoolsInfo()
        fetchBalance();
        fetchBalances();
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3, fetchPoolsInfo, fetchBalance, fetchBalances]);

  
  const openCard = id => {
    return setCardIsOpenedList(
      cardIsOpenedList => {
        if(cardIsOpenedList.includes(id)) {
          return cardIsOpenedList.filter(item => item!==id)
        } else {
          return [...cardIsOpenedList, id]
        }
      }
    )
  } 

  const openCardVault = id => {
    return setOpenCardList(
      openedCardList => {
        if(openedCardList.includes(id)) {
          return openedCardList.filter(item => item!==id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  }

  return (
    <Grid container style={{paddingTop: '4px'}}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Liquidity-Main-Title')}</div>
        <h3 className={classes.secondTitle}>{t('Vault-Second-Title')}</h3>
      </Grid>
      {vaultPools.filter(pool => (pool.chainId === networkId && pool.liquidityOnly)).map((pool, index) => (
        <Grid item xs={12} container key={index} style={{marginBottom: "24px"}} spacing={0}>
          <div style={{width: "100%"}}>
            <Accordion
                expanded={Boolean(openedCardList.includes(index))}
                className={classes.accordion}
                TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                  className={classes.details}
                  style={{ justifyContent: "space-between"}}
                  onClick={(event) => {
                      event.stopPropagation();
                      openCardVault(index)
                  }}
              >
                <PoolHeader index={index} pool={pool} classes={classes} openedCardList={openedCardList} openCard={openCardVault} />
              </AccordionSummary>
              <AccordionDetails style={{ justifyContent: "space-between"}}>
                <PoolContent index={index} pool={pool} classes={classes} openedCardList={openedCardList} openCard={openCardVault} />
              </AccordionDetails>
            </Accordion>
          </div>
        </Grid>
      ))}
      {pools.map((pool, poolIndex) => {
        return (
          <SectionPoolsCard
            pool={pool}
            poolIndex={poolIndex}
            cardIsOpenedList={cardIsOpenedList}
            openCard={openCard}/>  
        )
        })}
      
    </Grid>
  )
}
