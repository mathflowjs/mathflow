export default function initFinance() {
    return {
        futureValue: (principal: number, rate: number, periods: number) =>
            principal * (1 + rate) ** periods,
        presentValue: (future: number, rate: number, periods: number) =>
            future / (1 + rate) ** periods,
        // the accrued amount, compounding `times` per period
        compoundInterest: (
            principal: number,
            rate: number,
            times: number,
            periods: number
        ) => principal * (1 + rate / times) ** (times * periods),
        // the level payment that pays off `present` over `periods`
        annuityPayment: (rate: number, periods: number, present: number) =>
            rate === 0
                ? present / periods
                : (present * rate) / (1 - (1 + rate) ** -periods)
    };
}
