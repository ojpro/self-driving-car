const $ = (el) => document.querySelector(el);

function lerp(A,B,t){
    return A + (B-A) * t;
}

export  {
    lerp,
    $
}