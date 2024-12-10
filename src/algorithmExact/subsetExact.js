// Javascript implementation for subset sum
// problem using recursion
function isSubsetSumRec(arr, n, sum) {

    // Base Cases
    
    if (sum === 0) return true;
    if (n === 0) return false;    

    // If the last element is greater than
    // the sum, ignore it
    if (arr[n - 1] > sum) {
        return isSubsetSumRec(arr, n - 1, sum);
    }

    // Check if sum can be obtained by including
    // or excluding the last element
    return isSubsetSumRec(arr, n - 1, sum) || 
           isSubsetSumRec(arr, n - 1, sum - arr[n - 1]);
}

export function isSubsetSum(arr, sum) {
    return isSubsetSumRec(arr, arr.length, sum);
}
