/* eslint-disable no-param-reassign */
import { useEffect, useMemo, useState, CSSProperties } from 'react'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import Footer from 'components/Menu/Footer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
// import { useDefaultsFromURLSearch } from 'state/limitOrders/hooks'
import { AppBody } from 'components/App'
import { useTranslation } from '@pancakeswap/localization'
import { pulseChainTokens } from '@pancakeswap/tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BURN_ADDRESS } from 'config/constants'

import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSwapState, useSingleTokenSwapInfo } from '../../state/swap/hooks'
import { useExchangeChartManager } from '../../state/user/hooks'
import Page from '../Page'

import SwapForm from './components/SwapForm'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

import { getPairInformationByChain } from "dexscreener-api"

const CHART_SUPPORT_CHAIN_IDS = [ChainId.PULSE]
export const ACCESS_TOKEN_SUPPORT_CHAIN_IDS = [ChainId.PULSE]

const STABLE_SUPPORT_CHAIN_IDS = [ChainId.BSC_TESTNET, ChainId.PULSE]

const textBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: 'rgba(100, 100, 100, 0.3)',
  borderRadius: '10px',
  border: '4px solid lightgray',
  padding: '10px',
  marginBottom: '25px',
  width: 'min(100%, 620px)',
};

export const gradientOverlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'radial-gradient(50% 500px at 50% -6%, rgba(0, 41, 102, 0.7) 0%, rgb(7, 24, 50) 50%, rgb(6, 22, 45) 100%), radial-gradient(circle at -70% 50%, rgba(0, 43, 102, 0.7) 0px, transparent 50%)',
  opacity: 1,
  zIndex: -1,
};

export default function Swap() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)

  const { account } = useActiveWeb3React()
  const DEXCurrency = useCurrency(pulseChainTokens?.xfn?.address)
  const DEXBalance = useCurrencyBalance(account ?? undefined, DEXCurrency ?? undefined)
  const DEXBurnedBalance = useCurrencyBalance(BURN_ADDRESS, DEXCurrency ?? undefined)

  // useDefaultsFromURLSearch()

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  const { chainId } = useActiveWeb3React()

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const [DEXStats, setDEXStats] = useState<any>('')
  const [DEXPrice, setDEXPrice] = useState(0)

  function fetchDEXStats() {
    getPairInformationByChain("pulsechain", "0x635969e2c12ab4938f9b31bf69aca724df1f2c42").then((responseData) => {
      setDEXStats(responseData);
    }).catch((error) => console.error('Error fetching DEXStats', error))
  }

  function calculateSuffix(balance: number): { multipliedBalance: number; suffix: string } {
    let suffix = ''; // Can be "K" for thousand, "M" for million, "B" for billion, "T" for trillion

    if (balance >= 1e12) {
      balance /= 1e12;
      suffix = 'T';
    } else if (balance >= 1e9) {
      balance /= 1e9;
      suffix = 'B';
    } else if (balance >= 1e6) {
      balance /= 1e6;
      suffix = 'M';
    } else if (balance > 1000) {
      balance /= 1000;
      suffix = 'K';
    } // If the balance is less than 1000, no suffix needed.

    return { multipliedBalance: balance, suffix };
  }

  function calculateFormattedString(balance: number, length: number, suffix: string): string {
    if (suffix !== '') {
      length = length - 1
    }

    let formattedString: string;
    if (balance < 1) {
      // If the number is less than one, we want to keep only five significant digits including leading zeros before decimal point.
      const precision = Math.max(length - balance.toString().split('.')[0].length, 0);
      formattedString = `${balance.toFixed(precision)}`;
    } else {
      const precision = Math.max(length - balance.toString().split('.')[0].length, 0);
      formattedString = `${balance.toFixed(precision)}`;
    }
    const decimalPointIndex = formattedString.indexOf(".");
    if (decimalPointIndex !== -1) {
      // Calculate ASCII code for corresponding letter character
      let charCode = 97 + parseInt(formattedString[decimalPointIndex-1]);
      // Replace decimal point and leading number with the calculated letter to encode a digit with a decimal point
      formattedString = formattedString.replace(formattedString[decimalPointIndex-1] + ".", String.fromCharCode(charCode));
    }

    return formattedString + suffix;
  }

  function updateDEXPrice() {
    const price = DEXStats.pair?.priceUsd;
    if (typeof price === 'undefined') {
      setDEXPrice(0.0);
    } else {
      const multipliedPrice = price * 1000000000000; // Multiply the price by 1 trillion
      const formattedString = calculateFormattedString(multipliedPrice, 5, '');
    }
    setDEXPrice(prev => price);
  }


  useEffect(() => {
    fetchDEXStats();
    const interval = setInterval(fetchDEXStats, 30000);
    return () => clearInterval(interval) ;
  }, []);

  useEffect(() => {
    if (typeof DEXStats !== 'undefined') updateDEXPrice();
    const interval = setInterval(updateDEXPrice, 30000);
    return () => clearInterval(interval);
  }, [DEXStats]);


  return (
    // <div style={backgroundLogo}>
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded} isSwap={false} style={{minHeight: "calc(100vh - 190px)"}}>
      <div style={gradientOverlayStyle}></div>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <SwapForm
                  // isAccessTokenSupported={isAccessTokenSupported}
                  // setIsChartDisplayed={setIsChartDisplayed}
                  // isChartDisplayed={isChartDisplayed}
                />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Page>
    // </div>
  )
}
