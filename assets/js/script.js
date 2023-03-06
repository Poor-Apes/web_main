window.onload = function() {
    update_nft_type_stats(1);
};

// This was to rotate the cards but does not work properly
window.onscroll = function () {
    //scrollRotate();
};

function scrollRotate() {
    let image = document.getElementById("cards");
    image.style.transform = "rotate(" + window.pageYOffset/2 + "deg)";
}

// Ref: https://www.desmos.com/calculator/n21xiqgmxv
function mint_cost(nft_number) {
    var z = 0.085;
    var a = 0.1;
    var b = 1.067;
    var c = -10;
    var d = 0.0;
    return(a*(Math.pow(b,(z*nft_number)+c))+d).toFixed(2);
}

function holder_projected_roi(mint_cost) {
    return 12 / mint_cost;
}

function investor_projected_roi(mint_cost) {
    return 6 / mint_cost;
}

function mover_projected_roi(mint_cost) {
    return 5 / mint_cost;
}

function update_nft_type_stats(nft_number) {
    // NFT Number
    document.getElementById("slider_current_nft_number").innerHTML = nft_number;
    // Mint Cost
    document.getElementById("slider_mint_cost").innerHTML = mint_cost(nft_number);

    // Minting curves
    var investor_minting_curve = 0.5699;
    var mover_minting_curve = 0.285; 
    
    // Minted so far
    var investor_minted_so_far = 0;
    var mover_minted_so_far = 0;
    for (let i = 1; i <= nft_number; i++) {
        investor_minted_so_far += investor_minting_curve * (i / 700);
        mover_minted_so_far += mover_minting_curve * (i / 700);
    }
    investor_minted_so_far = Math.round(investor_minted_so_far);
    mover_minted_so_far = Math.round(mover_minted_so_far);
    document.getElementById("holder_minted_so_far").innerHTML = nft_number - investor_minted_so_far - mover_minted_so_far;
    document.getElementById("investor_minted_so_far").innerHTML = investor_minted_so_far;
    document.getElementById("mover_minted_so_far").innerHTML = mover_minted_so_far;

    // Chance of minting
    var investor_chance_of_minting = Math.round((investor_minting_curve * (nft_number / 700)) * 100);
    var mover_chance_of_minting = Math.round((mover_minting_curve * (nft_number / 700)) * 100);
    document.getElementById("holder_chance_of_minting").innerHTML = 100 - (investor_chance_of_minting + mover_chance_of_minting);
    document.getElementById("investor_chance_of_minting").innerHTML = investor_chance_of_minting;
    document.getElementById("mover_chance_of_minting").innerHTML = mover_chance_of_minting;

    // Expected ROI
    holder_projected_roi_val = holder_projected_roi(mint_cost(nft_number));
    investor_projected_roi_val = investor_projected_roi(mint_cost(nft_number));
    mover_projected_roi_val = mover_projected_roi(mint_cost(nft_number));

    if(holder_projected_roi_val < 10) {
        holder_projected_roi_val = holder_projected_roi_val.toFixed(1);
    } else {
        holder_projected_roi_val = holder_projected_roi_val.toFixed(0);
    }
    document.getElementById("holder_projected_roi").innerHTML = holder_projected_roi_val;

    if(investor_projected_roi_val < 10) {
        investor_projected_roi_val = investor_projected_roi_val.toFixed(1);
    } else {
        investor_projected_roi_val = investor_projected_roi_val.toFixed(0);
    }
    document.getElementById("investor_projected_roi").innerHTML = investor_projected_roi_val;

    if(mover_projected_roi_val < 10) {
        mover_projected_roi_val = mover_projected_roi_val.toFixed(1);
    } else {
        mover_projected_roi_val = mover_projected_roi_val.toFixed(0);
    }
    document.getElementById("mover_projected_roi").innerHTML = mover_projected_roi_val;
}


//// COUNT UP ANIMATION ////

const holder_projected_roi_animation_fired = false;
const investor_projected_roi_animation_fired = false;
const mover_projected_roi_animation_fired = false;

const animationDuration = 2000;
const frameDuration = 1000 / 60;
const totalFrames = Math.round( animationDuration / frameDuration );
const easeOutQuad = t => t * ( 2 - t );

const animateCountUp = el => {
    el_fired = window[el.id + '_animation_fired'];
    console.log(el.id);
    console.log(window[el.id + '_animation_fired'])
    if(el_fired == false) {
        update_nft_type_stats(document.getElementById("current_nft").value);
        let frame = 0;
        const countTo = parseInt( el.innerHTML, 10 );
        const counter = setInterval( () => {
            frame++;
            const progress = easeOutQuad( frame / totalFrames );
            const currentCount = Math.round( countTo * progress );
            if ( parseInt( el.innerHTML, 10 ) !== currentCount ) {
                el.innerHTML = currentCount;
            }
            if ( frame === totalFrames ) {
                clearInterval( counter );
            }
        }, frameDuration );
        el_fired = true;
    }
};


//// ELEMENT IN VIEW ////

var holder_roi_element = document.getElementById('holder_projected_roi');
var investor_roi_element = document.getElementById('investor_projected_roi');
var mover_roi_element = document.getElementById('mover_projected_roi');

document.addEventListener('scroll', animate);

function elmentInView(element) {
    var windowHeight = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollPosition = scrollY + windowHeight;
    var elementPosition = element.getBoundingClientRect().top + scrollY + element.clientHeight;
    //console.log("scrollPosition = " + scrollPosition);
    //console.log("elementPosition = " + elementPosition);
    if (scrollPosition > elementPosition) {
        return true;
    }
    return false;
}

function animate() {
    if (elmentInView(holder_roi_element)) {
        //const countupEls = document.querySelectorAll( '#holder_projected_roi' );
        //countupEls.forEach( animateCountUp );
    }
    if (elmentInView(investor_roi_element)) {
        //animateCountUp(investor_roi_element);
    }
    if (elmentInView(mover_roi_element)) {
        //animateCountUp(mover_roi_element);
    }
}