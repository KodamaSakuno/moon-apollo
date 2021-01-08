/* eslint-disable */
import React from 'react';
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
import { useAllowance, useFetchPoolBalances, useFetchApproval, useFetchDeposit, useFetchWithdraw, useFetchContractApy, useFetchExit, useFetchGetReward, useEarned, useBalanceOf } from '../redux/hooks';

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

export default function PoolHeader({ index, pool, classes, openedCardList, openCard }) {
    const { t, i18n } = useTranslation();
    const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));

    const tokenBalance = useBalanceOf(pool.tokenAddress);
    let balanceSingle = byDecimals(tokenBalance, pool.tokenDecimals);
    const depositedBalance = useBalanceOf(pool.earnContractAddress);
    let singleDepositedBalance = byDecimals(depositedBalance, pool.itokenDecimals);
    const earned = useEarned(pool.earnContractAddress)
    const formattedEarned = byDecimals(earned)

    const { contractApy } = useFetchContractApy();

    const [husdAPYLeft, husdAPYRight] = ["24.24%", "114.34"];
    const [usdtAPYLeft, usdtAPYRight] = ["63.60%", "84.15"];
    return (
        <Grid container alignItems="center" justify="space-around" spacing={4} style={{paddingTop: "16px", paddingBottom: "16px"}}>
                <Grid item>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar
                                alt={pool.token}
                                src={require(`../../../images/${pool.token}-logo.png`)}
                            />
                        </Grid>
                        <Grid item style={{minWidth: '100px'}}>
                                <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom>
                                    {pool.token}
                                    <Hidden smUp>
                                      <i
                                        style={{color:primaryColor[0],marginLeft:'4px',visibility:Boolean(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)?"visible":"hidden"}}
                                        className={"yfiiicon yfii-help-circle"}
                                        onClick={
                                            event => {
                                                event.stopPropagation();
                                                window.open(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)
                                            }
                                        }
                                        />
                                    </Hidden>
                                    <Hidden smUp>
                                      <i
                                        style={{color:primaryColor[0],marginLeft:'4px',visibility:!isEmpty(pool.depostAlert)?"visible":"hidden"}}
                                        className={"fas fa-exclamation"}
                                        onClick={
                                          event => {
                                            event.stopPropagation();
                                            setWaitDialogConfirmJson({'content':pool.depostAlert,'func':()=>{}})
                                            setOpenDialog(true);
                                          }
                                        }
                                        />
                                    </Hidden>
                                </Typography>
                            <Typography className={classes.iconContainerSubTitle} variant="body2">{pool.token}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item md={8} xs={3}>
                    <Grid item container justify="space-between">
                        <Hidden smDown>
                            <Grid item xs={3} container justify='center' alignItems="center">
                                <Grid item style={{width: "200px", textAlign: "center" }}>
                                    <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{forMat(balanceSingle)} { pool.token }</Typography>
                                    <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography></Grid>
                            </Grid>
                        </Hidden>
                        <Hidden mdDown>
                            <Grid item xs={3} container justify='center' alignItems="center">
                                <Grid item style={{width: "200px", textAlign: "center"}}>
                                    <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{forMat(singleDepositedBalance)} { pool.token }</Typography>
                                    <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Deposited')}</Typography>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Grid item xs={3} container justify='center' alignItems="center">
                            <Grid item style={{ textAlign: "center" }}>
                                <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{forMat(formattedEarned)} { pool.earnedToken }</Typography>
                                <Typography className={classes.iconContainerSubTitle} variant="body2">Earned</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={3} container justify='center' alignItems="center">
                            <Grid item style={{ textAlign: "center" }}>
                                <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap> {pool.token !== 'HUSD' ?
                                  (pool.token !== 'USDT' ? `${usdtAPYLeft} ~ ${usdtAPYRight}` : contractApy[pool.id] || 0) : 
                                  (`${husdAPYLeft} ~ ${husdAPYRight}`)
                                }</Typography>
                                <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-ListAPY')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item >
                    <Grid item container justify="flex-end" alignItems="center" spacing={2}>
                        <Hidden mdDown>
                          <Grid item>
                            <IconButton
                                classes={{
                                    root:classes.iconContainerSecond
                                }}
                                style={{visibility:Boolean(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)?"visible":"hidden"}}
                                // className={classes.iconContainerSecond}
                                onClick={
                                    event => {
                                        event.stopPropagation();
                                        window.open(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)
                                    }
                                }
                            >
                              <i className={"yfiiicon yfii-help-circle"} />
                            </IconButton>
                          </Grid>
                        </Hidden>
                        <Hidden mdDown>
                          <Grid item>
                            <IconButton
                              classes={{
                                  root:classes.iconContainerSecond
                              }}
                              style={{visibility:!isEmpty(pool.depostAlert)?"visible":"hidden"}}
                              onClick={
                                  event => {
                                    event.stopPropagation();
                                    setWaitDialogConfirmJson({'content':pool.depostAlert,'func':()=>{}})
                                    setOpenDialog(true);
                                  }
                              }
                            >
                              <i className={"fas fa-exclamation"} />
                            </IconButton>
                          </Grid>
                        </Hidden>
                        <Grid item>
                          <IconButton
                              className={classes.iconContainerPrimary}
                              onClick={(event) => {
                                event.stopPropagation();
                                openCard(index);
                              }}
                          >
                              {
                                openedCardList.includes(index) ? <i className={"yfiiicon yfii-arrow-up"} /> : <i className={"yfiiicon yfii-arrow-down"} />
                              }
                          </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
          </Grid>
    )
}