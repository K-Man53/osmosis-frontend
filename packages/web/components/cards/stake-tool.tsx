import { CoinPretty } from "@keplr-wallet/unit";
import React from "react";
import { useMemo } from "react";

import { Button } from "~/components/buttons";
import { EstimatedEarningCard } from "~/components/cards/estimated-earnings-card";
import { GenericMainCard } from "~/components/cards/generic-main-card";
import { StakeInfoCard } from "~/components/cards/stake-info-card";
import { UnbondingCard } from "~/components/cards/unbonding-card";
import { StakeTab } from "~/components/control/stake-tab";
import { StakeOrUnstake } from "~/components/types";
import { useTranslation } from "~/hooks";

export const StakeTool: React.FC<{
  hasInsufficientBalance: boolean;
  inputAmount?: string;
  handleHalfButtonClick: () => void;
  handleMaxButtonClick: () => void;
  isMax?: boolean;
  isHalf?: boolean;
  setInputAmount: (amount: string) => void;
  setShowValidatorNextStepModal: (val: boolean) => void;
  stakeAmount?: CoinPretty;
  activeTab: StakeOrUnstake;
  setActiveTab: (tab: StakeOrUnstake) => void;
  isWalletConnected: boolean;
  availableAmount?: CoinPretty;
  onStakeButtonClick: () => void;
  disabled: boolean;
}> = ({
  hasInsufficientBalance,
  inputAmount,
  handleHalfButtonClick,
  handleMaxButtonClick,
  isMax = false,
  isHalf = false,
  activeTab,
  setActiveTab,
  availableAmount,
  setInputAmount,
  stakeAmount,
  isWalletConnected,
  onStakeButtonClick,
  disabled,
}) => {
  const { t } = useTranslation();

  const buttonText = useMemo(() => {
    if (!isWalletConnected) return t("connectWallet");

    const showInsufficientText =
      inputAmount?.toString() !== "" && hasInsufficientBalance;

    if (showInsufficientText)
      return activeTab === "Stake"
        ? t("errors.insufficientBal")
        : t("errors.insufficientAmount");

    return activeTab === "Stake"
      ? t("stake.mainCardButtonText")
      : t("stake.mainCardButtonUnstakeText");
  }, [activeTab, isWalletConnected, t, hasInsufficientBalance, inputAmount]);

  return (
    <GenericMainCard title={t("stake.stake")}>
      <div className="flex justify-around">
        <StakeTab
          active={activeTab === "Stake"}
          onClick={() => setActiveTab("Stake")}
        >
          {t("stake.stake")}
        </StakeTab>
        <StakeTab
          active={activeTab === "Unstake"}
          onClick={() => setActiveTab("Unstake")}
        >
          {t("stake.unstake")}
        </StakeTab>
      </div>
      <StakeInfoCard
        handleHalfButtonClick={handleHalfButtonClick}
        isHalf={isHalf}
        handleMaxButtonClick={handleMaxButtonClick}
        isMax={isMax}
        availableAmount={availableAmount}
        setInputAmount={setInputAmount}
        inputAmount={inputAmount}
      />
      {activeTab === "Stake" ? (
        <EstimatedEarningCard stakeAmount={stakeAmount} />
      ) : (
        <UnbondingCard />
      )}
      <Button
        mode="special-1"
        onClick={onStakeButtonClick}
        disabled={disabled}
        className="disabled:cursor-not-allowed disabled:opacity-75"
      >
        {buttonText}
      </Button>
    </GenericMainCard>
  );
};
