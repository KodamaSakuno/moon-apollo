/* eslint-disable */
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import {primaryColor} from "assets/jss/material-kit-pro-react.js";
import { inputLimitPass,inputFinalVal,isEmpty } from 'features/helpers/utils';
import BigNumber from "bignumber.js";
import {byDecimals,calculateReallyNum} from 'features/helpers/bignumber';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import Button from "components/CustomButtons/Button.js";
import { useAllowance, useFetchPoolBalances, useApprove, useDeposit, useWithdraw, useFetchDeposit, useFetchWithdraw, useFetchContractApy, useFetchExit, useFetchGetReward, useEarned, useBalanceOf } from '../redux/hooks';

const forMat = number => {
    return new BigNumber(
      number
    ).multipliedBy(
      new BigNumber(10000)
    ).dividedToIntegerBy(
      new BigNumber(1)
    ).dividedBy(
      new BigNumber(10000)
    ).toNumber()
  }

export default function PoolContent({ index, pool, classes, openedCardList, openCard }) {
    const { t, i18n } = useTranslation();

    const tokenBalance = useBalanceOf(pool.tokenAddress);
    let balanceSingle = byDecimals(tokenBalance, pool.tokenDecimals);
    const depositedBalance = useBalanceOf(pool.earnContractAddress);
    let singleDepositedBalance = byDecimals(depositedBalance, pool.itokenDecimals);
    const allowance = useAllowance(pool.tokenAddress, pool.earnContractAddress)

    const { isPending: isApprovePending, onApprove } = useApprove(pool.tokenAddress, pool.earnContractAddress)
    const { onExit, isPending: isExitPending } = useFetchExit(pool.earnContractAddress)
    const { onGetReward, isPending: isGetRewardPending } = useFetchGetReward(pool.earnContractAddress)
    const { onDeposit, isPending: isDepositPending } = useDeposit(pool.earnContractAddress)
    const { onWithdraw, isPending: isWithdarwPending } = useWithdraw(pool.earnContractAddress)

    const [balanceToDeposit, setBalanceToDeposit] = useState('0');
    const [balanceToDepositSlider, setBalanceToDepositSlider] = useState(0);
    const [balanceToWithdraw, setBalanceToWithdraw] = useState('0');
    const [balanceToWithdrawSlider, setBalanceToWithdrawSlider] = useState(0);

    const changeDetailInputValue = (type,index,total,tokenDecimals,event) => {
      let value = event.target.value;
      if(!inputLimitPass(value,tokenDecimals)){
        return;
      }
      let sliderNum = 0;
      let inputVal = Number(value.replace(',',''));
      if(value){
          sliderNum = byDecimals(inputVal/total,0).toFormat(2) * 100;
      }
      switch(type){
          case 'depositedBalance':
            setBalanceToDeposit(inputFinalVal(value,total,tokenDecimals));
            setBalanceToDepositSlider(sliderNum);
            break;
          case 'withdrawAmount':
            setBalanceToWithdraw(inputFinalVal(value,total,tokenDecimals));
            setBalanceToWithdrawSlider(sliderNum);
          default:
              break;
      }
    }

    const handleDepositedBalance = (index,total,event,sliderNum) => {
      setBalanceToDeposit(sliderNum == 0 ? '0': calculateReallyNum(total,sliderNum));
      setBalanceToDepositSlider(sliderNum);
    }
    const handleWithdrawAmount = (index,total,event,sliderNum) => {
      setBalanceToWithdraw(sliderNum == 0 ? '0': calculateReallyNum(total,sliderNum));
      setBalanceToWithdrawSlider(sliderNum);
    };

    return (
      <Grid container style={{width: "100%", marginLeft: 0, marginRight: 0}}>
        <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
          <div className={classes.showDetailRight}>
                {t('Vault-Balance')}:{forMat(balanceSingle)} { pool.token }
          </div>
          <FormControl fullWidth variant="outlined">
              <CustomOutlinedInput
                  value={balanceToDeposit}
                  onChange={changeDetailInputValue.bind(this,'depositedBalance',index,balanceSingle,pool.tokenDecimals)}
                  />
          </FormControl>
          <CustomSlider
            classes={{
              root: classes.depositedBalanceSliderRoot,
              markLabel: classes.depositedBalanceSliderMarkLabel,
            }}
            aria-labelledby="continuous-slider"
            value={balanceToDepositSlider}
            onChange={handleDepositedBalance.bind(this,index,balanceSingle)}
          />

              <div>
                  {
                      allowance === '0' ? (
                          <div className={classes.showDetailButtonCon}>
                              <Button
                                  style={{
                                      backgroundColor:'#353848',
                                      color:'#FF2D82',
                                      boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                                      fontWeight: "bold"
                                  }}
                                  color="primary"
                                  onClick={onApprove}
                                  disabled={isApprovePending[index] }
                                  >
                                  {isApprovePending ? `${t('Vault-ApproveING')}` : `${t('Vault-ApproveButton')}`}
                              </Button>
                          </div>
                      ) : (
                          <div className={classes.showDetailButtonCon}>
                              <Button
                                  style={{
                                      width: '180px',
                                      margin: '12px 5px',
                                      fontSize: '14px',
                                      fontWeight:'bold',
                                      backgroundColor:'#353848',
                                      color:'#FF2D82',
                                      boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                  }}
                                  round
                                  onFocus={(event) => event.stopPropagation()}
                                  disabled={
                                     balanceToDepositSlider === 0 || isDepositPending
                                  }
                                  onClick={(event)=>{
                                    event.stopPropagation();
                                    if(!isEmpty(pool.depostAlert)){
                                      setWaitDialogConfirmJson({
                                        'content':pool.depostAlert,
                                        'func':()=>{onDeposit(pool, index, false, balanceSingle,event)}
                                      });
                                      setOpenDialog(true);
                                    }else{
                                      onDeposit(balanceToDepositSlider >= 100 ? tokenBalance : new BigNumber(balanceToDeposit).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10))
                                    }
                                  }}
                                  >{t('Vault-DepositButton')}
                              </Button>
                          </div>
                      )
                  }
              </div>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
              <div className={classes.showDetailRight}>
                      {forMat(singleDepositedBalance)} { pool.earnedToken }
                  </div>
              <FormControl fullWidth variant="outlined">
                  <CustomOutlinedInput
                      value={balanceToWithdraw}
                      onChange={changeDetailInputValue.bind(this,'withdrawAmount',index,singleDepositedBalance,pool.itokenDecimals)}
                      />
              </FormControl>
              <CustomSlider
                  classes={{
                      root: classes.drawSliderRoot,
                      markLabel: classes.drawSliderMarkLabel,
                  }}
                  aria-labelledby="continuous-slider"
                  value={balanceToWithdrawSlider}
                  onChange={handleWithdrawAmount.bind(this,index,singleDepositedBalance)}
                  />
              <div className={classes.showDetailButtonCon}>
                  <Button
                      style={{
                          width: '180px',
                          margin: '12px 5px',
                          fontSize: '14px',
                          fontWeight:'bold',
                          backgroundColor:'#353848',
                          color:'#635AFF',
                          boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                      }}
                      round
                      type="button"
                      color="primary"
                      disabled={isWithdarwPending}
                      onClick={() => onWithdraw(balanceToWithdrawSlider >= 100 ? depositedBalance : new BigNumber(balanceToWithdraw).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10))}
                      >
                      {isWithdarwPending ? `${t('Vault-WithdrawING')}`: `${t('Vault-WithdrawButton')}`}
                  </Button>
                  <Button
                      style={{
                          width: '180px',
                          margin: '12px 5px',
                          fontSize: '14px',
                          fontWeight:'bold',
                          backgroundColor:'#353848',
                          color:'#635AFF',
                          boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                      }}
                      round
                      type="button"
                      color="primary"
                      onClick={() => onGetReward()}
                      >
                      {isGetRewardPending ? `Claiming`: `Claim`}
                  </Button>
                  <Button
                      style={{
                          width: '180px',
                          margin: '12px 5px',
                          fontSize: '14px',
                          fontWeight:'bold',
                          backgroundColor:'#353848',
                          color:'#635AFF',
                          boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                      }}
                      round
                      type="button"
                      color="primary"
                      onClick={() => onExit()}
                      >
                      {isExitPending ? `Exiting`: `Exit`}
                  </Button>
              </div>
          </Grid>

        </Grid>
    )
}