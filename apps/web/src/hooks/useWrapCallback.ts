import { Currency, WNATIVE } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useWNativeContract } from './useContract'
import { useCallWithGasPrice } from './useCallWithGasPrice'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const wplsContract = useWNativeContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wplsContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency?.isNative && WNATIVE[chainId]?.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const amount = inputAmount.toSignificant(6)

                  // const txReceipt = await callWithGasPrice(wplsContract, 'deposit', undefined, {
                  //   value: `0x${inputAmount.quotient.toString(16)}`,
                  // })

                  const txReceipt = await wplsContract.deposit({value: `0x${inputAmount.quotient.toString(16)}`});
                    
                  const native = inputCurrency.symbol
                  const wrap = WNATIVE[chainId].symbol
                  addTransaction(txReceipt, {
                    summary: `Wrap ${amount} ${native} to ${wrap}`,
                    translatableSummary: { text: 'Wrap %amount% %native% to %wrap%', data: { amount, native, wrap } },
                    type: 'wrap',
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : t('Insufficient %symbol% balance', { symbol: inputCurrency.symbol }),
      }
    }
    if (WNATIVE[chainId]?.equals(inputCurrency) && outputCurrency?.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  // const txReceipt = await callWithGasPrice(wplsContract, 'withdraw', [
                  //   `0x${inputAmount.quotient.toString(16)}`,
                  // ])
                  const txReceipt = await wplsContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                    
                  const amount = inputAmount.toSignificant(6)
                  const wrap = WNATIVE[chainId].symbol
                  const native = outputCurrency.symbol
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${amount} ${wrap} to ${native}`,
                    translatableSummary: { text: 'Unwrap %amount% %wrap% to %native%', data: { amount, wrap, native } },
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : t('Insufficient %symbol% balance', { symbol: inputCurrency.symbol }),
      }
    }
    return NOT_APPLICABLE
  }, [wplsContract, chainId, inputCurrency, outputCurrency, t, inputAmount, balance, addTransaction, callWithGasPrice])
}
