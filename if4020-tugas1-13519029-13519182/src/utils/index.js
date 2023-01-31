import { det } from "mathjs";

export const removeNonalphabet = (string) => (
  string.replace(/((?![A-Za-z]+).)/g, "")
);

export const separatePerFiveLetters = (string) => {
  let i = 0;
  let result = '';

  for (let index = 0; index < string.length; index++) {
    if (i !== 0 && i % 5 === 0) {
      result = result.concat(' ');
    }
    result = result.concat(string[index]);
    i++;
  };

  return result;
};

export const gcd = (aRaw, bRaw) => {
  const a = Math.abs(aRaw);
  const b = Math.abs(bRaw);

  if (a == 0 || b == 0)
    return 0;
    
  if (a == b)
    return a;
    
  if (a > b)
    return gcd(a - b, b);
            
  return gcd(a, b - a);
};

export const coprime = (a, b) => {
  if (gcd(a, b) == 1)
    return true;
  else
    return false;    
};

export const modInverse = (a, m) => {
  for(let x = 1; x < m; x++) {
    if (((a % m) * (x % m)) % m == 1) {
      return x;
    };
  };
};

export const matrixMultiply = (mat1, mat2) => {
  // assumsion: mat2 is an array
  let i, k;
  let result = [...Array(mat1.length)].fill(0);

  for (i = 0; i < mat1.length; i++) {
    for (k = 0; k < mat2.length; k++) {
      result[i] += mat1[i][k] * mat2[k];
    }
  }

  return result;
};

export const getCofactor = (A,temp,p,q,n) => {
    let i = 0, j = 0;
   
    // Looping for each element of the matrix
    for (let row = 0; row < n; row++)
    {
        for (let col = 0; col < n; col++)
        {
            // Copying into temporary matrix only those element
            // which are not in given row and column
            if (row != p && col != q)
            {
                temp[i][j++] = A[row][col];
   
                // Row is filled, so increase row index and
                // reset col index
                if (j == n - 1)
                {
                    j = 0;
                    i++;
                }
            }
        }
    }
}

const determinant = (A,n) => {
    let N = A.length;
    let D = 0; // Initialize result
   
    // Base case : if matrix contains single element
    if (n == 1)
        return A[0][0];
   
    let temp = new Array(N);// To store cofactors
    for(let i=0;i<N;i++)
    {
        temp[i]=new Array(N);
    }
   
    let sign = 1; // To store sign multiplier
   
    // Iterate for each element of first row
    for (let f = 0; f < n; f++)
    {
        // Getting Cofactor of A[0][f]
        getCofactor(A, temp, 0, f, n);
        D += sign * A[0][f] * determinant(temp, n - 1);
   
        // terms are to be added with alternate sign
        sign = -sign;
    }
   
    return D;
}

export const adjoint = (A,adj) => {
  let N = A.length;

  if (N == 1)
  {
    adj[0][0] = 1;
    return;
  }
  
  // temp is used to store cofactors of A[][]
  let sign = 1;
  let temp = new Array(N);
  for(let i=0;i<N;i++)
  {
    temp[i]=new Array(N);
  }
  
  for (let i = 0; i < N; i++)
  {
    for (let j = 0; j < N; j++)
    {
      // Get cofactor of A[i][j]
      getCofactor(A, temp, i, j, N);

      // sign of adj[j][i] positive if sum of row
      // and column indexes is even.
      sign = ((i + j) % 2 == 0)? 1: -1;

      // Interchanging rows and columns to get the
      // transpose of the cofactor matrix
      adj[j][i] = (sign)*(determinant(temp, N-1));
    }
  }
}