function kSackRec(W, wt, val, index, memo) {
    // Base condition
    if (index < 0)
        return 0;

    if (memo[index][W] !== -1)
        return memo[index][W];

    // Store the value in the table before return
    if (wt[index] > W) {
        memo[index][W] = kSackRec(W, wt, val, index - 1, memo);
    } else {
        memo[index][W] = Math.max(val[index] + kSackRec(W - wt[index], wt, val, index - 1, memo),
                                   kSackRec(W, wt, val, index - 1, memo));
    }

    return memo[index][W];
}

function kSack(W, wt, val) {
    const n = wt.length;
    const memo = Array.from({ length: n }, () => Array(W + 1).fill(-1));
    return kSackRec(W, wt, val, n - 1, memo);
}

export { kSack, kSackRec };