let rPelvis, rSpine, rTorso, rSkull, rBlade;
let imgPelvisSmall = [];
let imgPelvisMedium = [];
let imgPelvisLarge = [];
let imgSpine = [];
let imgTorsoSmall = []; // New: Declare array for small torso images
let imgTorsoMedium = []; // New: Declare array for medium torso images
let imgTorsoLarge = []; // New: Declare array for large torso images
let imgSkulls = [];
let imgSkullsSmall = []; // NEW: Declare array for small skull images
let imgSkullsMedium = []; // NEW: Declare array for medium skull images
let imgSkullsLarge = []; // NEW: Declare array for large skull images
let imgJaws = [];
let imgMarks = []; // Assuming 'chips' are 'marks'
let imgNoses = [];
let imgEyes = [];
let imgPupils = []; // New: Declare array for pupil images
let imgLegsBackSmall = []; // NEW: Declare array for small back leg images
let imgLegsBackMedium = []; // NEW: Declare array for medium back leg images
let imgLegsBackLarge = []; // NEW: Declare array for large back leg images
let imgLegsFrontSmall = []; // NEW: Declare array for small front leg images
let imgLegsFrontMedium = []; // NEW: Declare array for medium front leg images
let imgLegsFrontLarge = []; // NEW: Declare array for large front leg images
let imgBlades = []; // New: Declare array for blade images
let imgArmsBack = []; // NEW: Declare array for back arm images
let imgArmsBack_1h = []; // NEW: Declare array for 1-hand back arm images
let imgArmsFrontIdle = []; // NEW: Declare array for front arm idle images
let imgArmsFrontExpress = []; // NEW: Declare array for front arm express images
let imgArmsFrontInteract = []; // NEW: Declare array for front arm interact images
let imgArmsFrontPhone = []; // NEW: Declare array for front arm phone images
let imgArmsBackHello = []; // NEW: Declare array for back arm hello images

// NEW: Variable to hold the loaded asset library JSON data
let assetLibraryData;

// --- JUNO RECIPE TUNEABLE VARIABLES START ---

// Collision detection threshold: How much overlap is allowed before a "collision" is registered.
// A higher value (closer to 1.0) means more overlap is allowed before a re-roll.
// If 1.0, circles can touch exactly. If > 1.0, they can visually overlap by that factor.
const COLLISION_OVERLAP_FACTOR = 0.9;
const COLLISION_PIXEL_BUFFER = -40;

// Specific stricter buffer for Spine-Torso collision
const SPINE_TORSO_COLLISION_BUFFER = -20; // Slightly stricter than general buffer

// Offset variables for body parts (adjust these to fine-tune positions)
let pelvisOffsetX = 0;
let pelvisOffsetY = 0;
let spineOffsetX = 0;
let spineOffsetY = 0;
let torsoOffsetX = 0;
let torsoOffsetY = 0;
let skullOffsetX = 0;
let skullOffsetY = -150;
let jawOffsetX = 0;
let jawOffsetY = -150;
let markOffsetX = 0;
let markOffsetY = -150; // Base offset for marks
let noseOffsetX = 0;
let noseOffsetY = -150;
let eyeOffsetX = 0;
let eyeOffsetY = -150;
let pupilOffsetX = 0;
let pupilOffsetY = -150;

// Blade offset and size adjustment variables
let bladeFrontOffsetX = 0;
let bladeFrontOffsetY = 20;
let bladeFrontScaleX = 1.1;
let bladeFrontScaleY = 1.1;
let bladeBackOffsetX = 0;
let bladeBackOffsetY = 20;
let bladeBackScaleX = 0.9;
let bladeBackScaleY = 0.9;

// Arm offsets
let armFrontOffsetX = -10; // Renamed and adjusted as needed
let armFrontOffsetY = 30; // Renamed and adjusted as needed
let armBackOffsetX = -130; // Adjust as needed
let armBackOffsetY = 30; // Adjust as needed

// Base offsets for legs (these will be adjusted by size)
let baseLegBackOffsetX = 50;
let baseLegBackOffsetY = 50;
let baseLegFrontOffsetX = -30;
let baseLegFrontOffsetY = 50;

// Base distances for blades (different for front and back)
let bladeFrontDist = 100; // Initial distance for the front blade
let bladeBackDist = 70; // Initial distance for the back blade
let bladeFrontSideOffset = -1; // -1 for left side
let bladeBackSideOffset = 1; // +1 for right side

// NEW: Blade X-axis position compensation for torso scaling (manual fine-tune)
let bladeXCompensationFactor = 0.4; // Adjust this value to control compensation strength

// Torso collision circle adjustment
let torsoCollisionOffsetYLarge = 20; // Adjust this to lower the collision circle for large torsos

// Define size-specific adjustments for leg placement (fine-tune these)
const legSizeAdjustments = {
  "small": { backX: -50, backY: 0, frontX: 30, frontY: 0 },
  "medium": { backX: -30, backY: 0, frontX: 10, frontY: 0 },
  "large": { backX: -10, backY: 10, frontX: -20, frontY: 10 }
};

// Define size-specific adjustments for blade placement (fine-tune these)
const bladeSizeAdjustments = {
  "small": { distFactor: 0.8 }, // Closer
  "medium": { distFactor: 1.4 }, // Default
  "large": { distFactor: 2 } // Further
};

// Define size-specific adjustments for mark placement on skulls (fine-tune these)
const markHeightAdjustments = {
  "small": 0, // No extra adjustment for small
  "medium": -25, // A little higher for medium
  "large": -45 // Even higher for large
};

// Y-offset compensation for character based on leg size (fine-tune these)
const characterYOffsetByLegSize = {
  "small": 260, // Lower by 150 pixels for small legs
  "medium": 120, // Lower by 100 pixels for medium legs
  "large": 0 // No extra offset for large legs
};

// Factor to adjust how much legs compensate for pelvis X-axis scaling
const PELVIS_LEG_X_COMPENSATION_FACTOR = -0.2;

// Factor to adjust how much pelvis Y-axis compensates for X-axis scaling
const PELVIS_Y_COMPENSATION_FACTOR = -0.1;

// --- JUNO RECIPE TUNEABLE VARIABLES END ---


// Current size of selected torso/pelvis
let currentPelvisSize = "medium"; // Default
let currentTorsoSize = "medium"; // Default
let currentSkullSize = "medium"; // NEW: Default skull size

let headRotationAngle = 0; // Declare global variable for head rotation

// Global variables for bezier length range
let bezierLengthMin;
let bezierLengthMax;

// NEW: Global variable for overall scale slider
let overallScaleMinLabel, overallScaleMaxLabel, overallScaleMinSlider, overallScaleMaxSlider;
let currentOverallScale; // To store the randomized overall scale

// Declare variables to store randomized values for display in info panel
let headXOffset;
let terminalPointXOffset;
let headRandomScaleFactor; // Declare global for head random scale factor
let pelvisRandomScaleFactor; // NEW: Declare global for pelvis random scale factor
let torsoRandomScaleFactor; // NEW: Declare global for torso random scale factor

// NEW: Global variable for show/hide debug elements
let showDebugElementsCheckbox;

// Global variables for sliders and their labels
let initialAngleMinLabel, initialAngleMaxLabel, initialAngleMinSlider, initialAngleMaxSlider;
let initialIntensityMinLabel, initialIntensityMaxLabel, initialIntensityMinSlider, initialIntensityMaxSlider;
let terminalAngleMinLabel, terminalAngleMaxLabel, terminalAngleMinSlider, terminalAngleMaxSlider;
let terminalIntensityMinLabel, terminalIntensityMaxLabel, terminalIntensityMinSlider, terminalIntensityMaxSlider;
let verticalDispMinLabel, verticalDispMaxLabel, verticalDispMinSlider, verticalDispMaxSlider;
let point1PosMinLabel, point1PosMaxLabel, point1PosMinSlider, point1PosMaxSlider; // UPDATED to min/max sliders
let point2PosMinLabel, point2PosMaxLabel, point2PosMinSlider, point2PosMaxSlider; // UPDATED to min/max sliders
let terminalPointXMinLabel, terminalPointXMaxLabel, terminalPointXMinSlider, terminalPointXMaxSlider;
let headXOffsetMinLabel, headXOffsetMaxLabel, headXOffsetMinSlider, headXOffsetMaxSlider;
let overallScaleLabel;
let collisionDetectionCheckbox;
// NEW: Global variables for green hue sliders
let greenHueMinLabel, greenHueMaxLabel, greenHueMinSlider, greenHueMaxSlider;
// NEW: Global variables for green saturation sliders
let greenSaturationMinLabel, greenSaturationMaxLabel, greenSaturationMinSlider, greenSaturationMaxSlider;
// NEW: Global variables for green brightness sliders
let greenBrightnessMinLabel, greenBrightnessMaxLabel, greenBrightnessMinSlider, greenBrightnessMaxSlider;
// NEW: Global variables for general brightness sliders
let generalBrightnessMinLabel, generalBrightnessMaxLabel, generalBrightnessMinSlider, generalBrightnessMaxSlider;

// Global variables for curve points and image references
let currentSpineImage, currentBladeFrontImage, currentBladeBackImage, currentArmFrontIdleImage, currentArmBackImage;
let currentLegBackImage, currentLegFrontImage;
let currentPelvisImage, currentTorsoImage, currentSkullImage, currentJawImage, currentMarkImage, currentNoseImage, currentEyeImage, currentPupilImage;
let initialAngle, initialIntensity, terminalAngle, terminalIntensity, randomVerticalLength;
let tPoint1, tPoint2;
let x1, y1, x2, y2, cx1, cy1, cx2, cy2;
let p1x, p1y, pPoint1X, pPoint1Y, pPoint2X, pPoint2Y, p2x, p2y;

// NEW: Global variable for the current random green hue, saturation, and brightness
let currentSkeletonGreenHue;
let currentSkeletonGreenSaturation;
let currentSkeletonGreenBrightness;
// NEW: Global variable for the current random general brightness
let currentSkeletonGeneralBrightness;

// Cache for recolored images to avoid repeated processing
const recoloredImageCache = {};

function preload() {
  // Load the external JSON asset library file
  // Using the provided placeholder URL for the JSON file
  assetLibraryData = loadJSON('https://raw.githubusercontent.com/skeenee/skullito-assets/refs/heads/main/SKULLITOS_assetLibrary.json', () => {
    console.log("Asset library loaded successfully.");
    
    // Function to load images from a given URL list into an array
    function loadImagesFromUrls(urls, targetArray) {
      if (!urls) {
        console.warn("URLs array is undefined or null.");
        return;
      }
      for (let url of urls) {
        loadImage(url, img => {
          targetArray.push(img);
        }, (e) => console.error(`Failed to load image from ${url}:`, e));
      }
    }

    // Load pelvis images into their specific size arrays
    loadImagesFromUrls(assetLibraryData.pelvis_small, imgPelvisSmall);
    loadImagesFromUrls(assetLibraryData.pelvis_medium, imgPelvisMedium);
    loadImagesFromUrls(assetLibraryData.pelvis_large, imgPelvisLarge);

    // Load torso images into their specific size arrays (NEW)
    loadImagesFromUrls(assetLibraryData.torso_small, imgTorsoSmall);
    loadImagesFromUrls(assetLibraryData.torso_medium, imgTorsoMedium);
    loadImagesFromUrls(assetLibraryData.torso_large, imgTorsoLarge);

    loadImagesFromUrls(assetLibraryData.spines, imgSpine);
    
    // imgSkulls is no longer used directly for loading all skulls
    loadImagesFromUrls(assetLibraryData.skulls_small, imgSkullsSmall); // NEW: Load small skulls
    loadImagesFromUrls(assetLibraryData.skulls_medium, imgSkullsMedium); // NEW: Load medium skulls
    loadImagesFromUrls(assetLibraryData.skulls_large, imgSkullsLarge); // NEW: Load large skulls
    loadImagesFromUrls(assetLibraryData.jaws, imgJaws);
    loadImagesFromUrls(assetLibraryData.marks, imgMarks);
    loadImagesFromUrls(assetLibraryData.noses, imgNoses);
    loadImagesFromUrls(assetLibraryData.eyes, imgEyes);
    loadImagesFromUrls(assetLibraryData.pupils, imgPupils);

    // Load leg images into their specific size arrays (UPDATED)
    loadImagesFromUrls(assetLibraryData.legsBack_small, imgLegsBackSmall);
    loadImagesFromUrls(assetLibraryData.legsBack_medium, imgLegsBackMedium);
    loadImagesFromUrls(assetLibraryData.legsBack_large, imgLegsBackLarge);
    loadImagesFromUrls(assetLibraryData.legsFront_small, imgLegsFrontSmall);
    loadImagesFromUrls(assetLibraryData.legsFront_medium, imgLegsFrontMedium);
    loadImagesFromUrls(assetLibraryData.legsFront_large, imgLegsFrontLarge);

    loadImagesFromUrls(assetLibraryData.blades, imgBlades);
    loadImagesFromUrls(assetLibraryData.armsBack, imgArmsBack); // NEW: Load arms back
    loadImagesFromUrls(assetLibraryData.armsBack_1h, imgArmsBack_1h); // NEW: Load 1-hand back arms
    loadImagesFromUrls(assetLibraryData.armsFront_idle, imgArmsFrontIdle); // NEW: Load arms front idle
    loadImagesFromUrls(assetLibraryData.armsFront_express, imgArmsFrontExpress); // NEW: Load arms front express
    loadImagesFromUrls(assetLibraryData.armsFront_interact, imgArmsFrontInteract); // NEW: Load arms front interact
    loadImagesFromUrls(assetLibraryData.armsFront_phone, imgArmsFrontPhone); // NEW: Load arms front phone
    loadImagesFromUrls(assetLibraryData.armsBack_hello, imgArmsBackHello); // NEW: Load arms back hello
  }, (e) => {
    console.error("Failed to load asset library JSON:", e);
    // Optionally provide a fallback or halt execution if assets are critical
  });
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // detect touch-capable devices once
  window.isMobile = (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && width < 767;
  cnv.elt.style.touchAction = "none";
  cnv.elt.addEventListener('touchmove', e => {
    e.preventDefault();
  }, { passive: false });
  frameRate(1);

  // Set color mode to HSB for easier green manipulation
  colorMode(HSB, 360, 100, 100, 255);

  // Create a container for all UI elements to manage their position easily
  uiContainer = createDiv('');
  uiContainer.position(10, 10);
  uiContainer.style('color', 'white');
  uiContainer.style('font-family', 'monospace');
  uiContainer.style('font-size', '14px');
  uiContainer.style('padding', '10px');
  uiContainer.style('background-color', 'rgba(0,0,0,0.5)');
  uiContainer.style('border-radius', '5px');
  uiContainer.style('width', '520px'); // Increased width for two columns
  uiContainer.style('display', 'flex'); // Use flexbox for easier column management
  uiContainer.style('flex-wrap', 'wrap'); // Allow items to wrap if needed
  uiContainer.style('align-items', 'flex-start'); // Align items to the top

  // Create two columns inside the main UI container
  let uiColumn1 = createDiv('');
  uiColumn1.parent(uiContainer);
  uiColumn1.style('width', '250px');
  uiColumn1.style('padding-right', '10px'); // Add some padding between columns
  uiColumn1.style('box-sizing', 'border-box'); // Include padding in width calculation
  uiColumn1.style('display', 'flex'); // Make column 1 a flex container
  uiColumn1.style('flex-direction', 'column'); // Stack items vertically

  let uiColumn2 = createDiv('');
  uiColumn2.parent(uiContainer);
  uiColumn2.style('width', '250px');
  uiColumn2.style('padding-left', '10px'); // Add some padding between columns
  uiColumn2.style('box-sizing', 'border-box'); // Include padding in width calculation
  uiColumn2.style('display', 'flex'); // Make column 2 a flex container
  uiColumn2.style('flex-direction', 'column'); // Stack items vertically

  let sliderWidth = 150;
  let labelWidth = 50;
  let groupGap = 20;

  // Helper to create a labeled slider pair, now accepting a parent div
  function createRangeSliders(groupName, minRange, maxRange, defaultMin, defaultMax, step, parentDiv, unit = '') {
    let groupDiv = createDiv('');
    groupDiv.parent(parentDiv);
    groupDiv.style('margin-bottom', groupGap + 'px');

    let title = createDiv(groupName);
    title.parent(groupDiv);
    title.style('margin-bottom', '5px');

    let minSliderContainer = createDiv('');
    minSliderContainer.parent(groupDiv);
    minSliderContainer.style('display', 'flex');
    minSliderContainer.style('align-items', 'center');
    minSliderContainer.style('margin-bottom', '5px');

    let minSlider = createSlider(minRange, maxRange, defaultMin, step);
    minSlider.parent(minSliderContainer);
    minSlider.style('width', sliderWidth + 'px');
    minSlider.style('margin-right', '10px');

    let minLabel = createDiv(`Min: ${defaultMin}${unit}`);
    minLabel.parent(minSliderContainer);
    minLabel.style('width', labelWidth + 'px');

    let maxSliderContainer = createDiv('');
    maxSliderContainer.parent(groupDiv);
    maxSliderContainer.style('display', 'flex');
    maxSliderContainer.style('align-items', 'center');
    maxSliderContainer.style('margin-bottom', '5px');

    let maxSlider = createSlider(minRange, maxRange, defaultMax, step);
    maxSlider.parent(maxSliderContainer);
    maxSlider.style('width', sliderWidth + 'px');
    maxSlider.style('margin-right', '10px');

    let maxLabel = createDiv(`Max: ${defaultMax}${unit}`);
    maxLabel.parent(maxSliderContainer);
    maxLabel.style('width', labelWidth + 'px');

    return { minLabel, maxLabel, minSlider, maxSlider };
  }

  // Helper to create a single labeled slider, now accepting a parent div
  function createSingleSlider(groupName, minRange, maxRange, defaultValue, step, parentDiv, unit = '') {
    let groupDiv = createDiv('');
    groupDiv.parent(parentDiv);
    groupDiv.style('margin-bottom', groupGap + 'px');

    let title = createDiv(groupName);
    title.parent(groupDiv);
    title.style('margin-bottom', '5px');

    let sliderContainer = createDiv('');
    sliderContainer.parent(groupDiv);
    sliderContainer.style('display', 'flex');
    sliderContainer.style('align-items', 'center');
    sliderContainer.style('margin-bottom', '5px');

    let singleSlider = createSlider(minRange, maxRange, defaultValue, step);
    singleSlider.parent(sliderContainer);
    singleSlider.style('width', sliderWidth + 'px');
    singleSlider.style('margin-right', '10px');

    let valueLabel = createDiv(`Value: ${defaultValue}${unit}`);
    valueLabel.parent(sliderContainer);
    valueLabel.style('width', labelWidth + 'px');

    return { valueLabel, singleSlider };
  }

  // COLUMN 1 SLIDERS

  // Initial Angle Range
  let iaResults = createRangeSliders('Initial Angle Range:', 250, 280, 250, 280, 1, uiColumn1, '°');
  initialAngleMinLabel = iaResults.minLabel;
  initialAngleMaxLabel = iaResults.maxLabel;
  initialAngleMinSlider = iaResults.minSlider;
  initialAngleMaxSlider = iaResults.maxSlider;

  // Initial Intensity Range
  let iiResults = createRangeSliders('Initial Intensity Range:', 0, 180, 0, 180, 1, uiColumn1);
  initialIntensityMinLabel = iiResults.minLabel;
  initialIntensityMaxLabel = iiResults.maxLabel;
  initialIntensityMinSlider = iiResults.minSlider;
  initialIntensityMaxSlider = iiResults.maxSlider;

  // Terminal Angle Range
  let taResults = createRangeSliders('Terminal Angle Range:', 200, 300, 200, 300, 1, uiColumn1, '°');
  terminalAngleMinLabel = taResults.minLabel;
  terminalAngleMaxLabel = taResults.maxLabel;
  terminalAngleMinSlider = taResults.minSlider;
  terminalAngleMaxSlider = taResults.maxSlider;

  // Terminal Intensity Range
  let tiResults = createRangeSliders('Terminal Intensity Range:', 0, 180, 0, 180, 1, uiColumn1);
  terminalIntensityMinLabel = tiResults.minLabel;
  terminalIntensityMaxLabel = tiResults.maxLabel;
  terminalIntensityMinSlider = tiResults.minSlider;
  terminalIntensityMaxSlider = tiResults.maxSlider;

  // Bezier Vertical Displacement Range
  let blResults = createRangeSliders('Bezier Vertical Displacement Range:', 290, 500, 290, 500, 1, uiColumn1);
  verticalDispMinLabel = blResults.minLabel;
  verticalDispMaxLabel = blResults.maxLabel;
  verticalDispMinSlider = blResults.minSlider;
  verticalDispMaxSlider = blResults.maxSlider;
  // Initialize bezierLengthMin and Max
  bezierLengthMin = verticalDispMinSlider.value();
  bezierLengthMax = verticalDispMaxSlider.value();

  // Green Brightness Range (now a range slider and in COLUMN 1)
  let gbResults = createRangeSliders('Skeleton Green Brightness:', 0, 100, 60, 100, 1, uiColumn1, '%'); // Default green brightness range
  greenBrightnessMinLabel = gbResults.minLabel;
  greenBrightnessMaxLabel = gbResults.maxLabel;
  greenBrightnessMinSlider = gbResults.minSlider;
  greenBrightnessMaxSlider = gbResults.maxSlider;

  // NEW: General Brightness Range (now a range slider and in COLUMN 1)
  let genBResults = createRangeSliders('Skeleton General Brightness:', 0, 100, 80, 100, 1, uiColumn1, '%'); // Default general brightness range
  generalBrightnessMinLabel = genBResults.minLabel;
  generalBrightnessMaxLabel = genBResults.maxLabel;
  generalBrightnessMinSlider = genBResults.minSlider;
  generalBrightnessMaxSlider = genBResults.maxSlider;

  // COLUMN 2 SLIDERS

  // Point 1 Position (t-value) Range (UPDATED TO RANGE SLIDER)
  let p1Results = createRangeSliders('Point 1 Position (t-value) Range:', 0.10, 0.40, 0.15, 0.25, 0.01, uiColumn2);
  point1PosMinLabel = p1Results.minLabel;
  point1PosMaxLabel = p1Results.maxLabel;
  point1PosMinSlider = p1Results.minSlider;
  point1PosMaxSlider = p1Results.maxSlider;

  // Point 2 Position (t-value) Range (UPDATED TO RANGE SLIDER)
  let p2Results = createRangeSliders('Point 2 Position (t-value) Range:', 0.50, 0.80, 0.50, 0.80, 0.01, uiColumn2);
  point2PosMinLabel = p2Results.minLabel;
  point2PosMaxLabel = p2Results.maxLabel;
  point2PosMinSlider = p2Results.minSlider;
  point2PosMaxSlider = p2Results.maxSlider;

  // Terminal Point X Position (now a range slider)
  let tpXResults = createRangeSliders('Terminal Point X Position:', -200, 250, -200, 250, 1, uiColumn2);
  terminalPointXMinLabel = tpXResults.minLabel;
  terminalPointXMaxLabel = tpXResults.maxLabel;
  terminalPointXMinSlider = tpXResults.minSlider;
  terminalPointXMaxSlider = tpXResults.maxSlider;

  // Head Elements X Offset (now a range slider)
  let hxoResults = createRangeSliders('Head Elements X Offset:', 50, 150, 50, 150, 1, uiColumn2);
  headXOffsetMinLabel = hxoResults.minLabel;
  headXOffsetMaxLabel = hxoResults.maxLabel;
  headXOffsetMinSlider = hxoResults.minSlider;
  headXOffsetMaxSlider = hxoResults.maxSlider;

  // Overall Skeleton Scale Slider (now a range slider)
  let osResults = createRangeSliders('Overall Skeleton Scale:', 0.1, 3.0, 0.3, 0.7, 0.01, uiColumn2);
  overallScaleMinLabel = osResults.minLabel;
  overallScaleMaxLabel = osResults.maxLabel;
  overallScaleMinSlider = osResults.minSlider;
  overallScaleMaxSlider = osResults.maxSlider;

  // Green Hue Range (now a range slider)
  let ghResults = createRangeSliders('Skeleton Green Hue:', 0, 360, 60, 140, 1, uiColumn2, '°'); // Default green hue range
  greenHueMinLabel = ghResults.minLabel;
  greenHueMaxLabel = ghResults.maxLabel;
  greenHueMinSlider = ghResults.minSlider;
  greenHueMaxSlider = ghResults.maxSlider;

  // Green Saturation Range (now a range slider)
  let gsResults = createRangeSliders('Skeleton Green Saturation:', 0, 100, 30, 80, 1, uiColumn2, '%'); // Default green saturation range
  greenSaturationMinLabel = gsResults.minLabel;
  greenSaturationMaxLabel = gsResults.maxLabel;
  greenSaturationMinSlider = gsResults.minSlider;
  greenSaturationMaxSlider = gsResults.maxSlider;

  // Collision Detection Toggle
  let collisionToggleDiv = createDiv('');
  collisionToggleDiv.parent(uiColumn2);
  collisionToggleDiv.style('margin-bottom', groupGap + 'px');

  let collisionTitle = createDiv('Collision Detection:');
  collisionTitle.parent(collisionToggleDiv);
  collisionTitle.style('margin-bottom', '5px');

  collisionDetectionCheckbox = createCheckbox('', false);
  collisionDetectionCheckbox.parent(collisionToggleDiv);
  collisionDetectionCheckbox.style('display', 'inline-block');

  // NEW: Show Debug Elements Toggle
  let showDebugToggleDiv = createDiv('');
  showDebugToggleDiv.parent(uiColumn2);
  showDebugToggleDiv.style('margin-bottom', groupGap + 'px');

  let debugTitle = createDiv('Show Debug Elements:');
  debugTitle.parent(showDebugToggleDiv);
  debugTitle.style('margin-bottom', '5px');

  showDebugElementsCheckbox = createCheckbox('', false);
  showDebugElementsCheckbox.parent(showDebugToggleDiv);
  showDebugElementsCheckbox.style('display', 'inline-block');

  // --- Create info panel on the right side ---
  infoPanel = createDiv('');
  infoPanel.style('color', 'white');
  infoPanel.style('font-family', 'monospace');
  infoPanel.style('font-size', '14px');
  infoPanel.style('padding', '10px');
  infoPanel.style('background-color', 'rgba(0,0,0,0.5)');
  infoPanel.style('border-radius', '5px');
  infoPanel.style('width', '250px');

  // Position it on the right side, with some margin
  infoPanel.position(width - 270, 10);

  // Create sub-divs for each section inside the infoPanel
  currentRandomizedValuesDiv = createDiv('');
  currentRandomizedValuesDiv.parent(infoPanel);
  currentRandomizedValuesDiv.style('margin-bottom', '20px');

  curvePointCoordinatesDiv = createDiv('');
  curvePointCoordinatesDiv.parent(infoPanel);
}

// Function to recolor green parts of an image and apply general brightness
function processSkeletonImage(img, newGreenHue, newGreenSaturation, newGreenBrightness, generalBrightness) {
  if (!img) return null; // Return null if image is not loaded

  // Create a unique cache key for all parameters
  const cacheKey = `${img.canvas.toDataURL()}_${newGreenHue}_${newGreenSaturation}_${newGreenBrightness}_${generalBrightness}`;

  // Check if the processed image is already in the cache
  if (recoloredImageCache[cacheKey]) {
    return recoloredImageCache[cacheKey];
  }

  // Create a graphics buffer to draw the image and manipulate pixels
  let pg = createGraphics(img.width, img.height);
  pg.image(img, 0, 0);
  pg.loadPixels();

  // Define the green hue range (e.g., 60 to 180 degrees in HSB)
  const minGreenHue = 60;
  const maxGreenHue = 180;
  const minSaturationThreshold = 10; // Minimum saturation for a pixel to be considered "green"
  const minOriginalBrightness = 5; // Minimum brightness for a pixel to be considered "green"
  const maxOriginalBrightness = 95; // Maximum brightness for a pixel to be considered "green"

  for (let i = 0; i < pg.pixels.length; i += 4) {
    let r = pg.pixels[i];
    let g = pg.pixels[i + 1];
    let b = pg.pixels[i + 2];
    let a = pg.pixels[i + 3];

    // Skip transparent pixels
    if (a === 0) continue;

    // Temporarily switch to RGB colorMode to interpret r,g,b correctly
    push(); // Save current colorMode
    colorMode(RGB, 255, 255, 255, 255);
    let tempColor = color(r, g, b, a);
    let h = hue(tempColor);
    let s = saturation(tempColor);
    let br = brightness(tempColor);
    pop(); // Restore previous colorMode

    let finalHue = h;
    let finalSaturation = s;
    let finalBrightness = br;

    // Check if the pixel's hue, saturation, and brightness are within the green criteria
    let isGreen = false;
    if (h >= minGreenHue && h <= maxGreenHue && s > minSaturationThreshold && br > minOriginalBrightness && br < maxOriginalBrightness) {
      isGreen = true;
    }

    if (isGreen) {
      // Apply new green hue, saturation, and relative brightness
      finalHue = newGreenHue;
      finalSaturation = newGreenSaturation;
      // Calculate a relative brightness based on the original pixel's brightness
      // This preserves the internal shading/highlights of the green parts
      let relativeBrightnessFactor = map(br, 0, 100, 0, 1); // Normalize original brightness to 0-1
      finalBrightness = newGreenBrightness * relativeBrightnessFactor; // Apply newGreenBrightness as a scaling factor
    }

    // Apply general brightness to all pixels
    // The generalBrightness parameter is a percentage (0-100), so map it to a factor (0-1)
    let generalBrightnessFactor = map(generalBrightness, 0, 100, 0, 1);
    finalBrightness *= generalBrightnessFactor; // Scale the brightness

    // Ensure brightness stays within valid HSB range [0, 100]
    finalBrightness = constrain(finalBrightness, 0, 100);
    finalSaturation = constrain(finalSaturation, 0, 100);

    // Create the new color in HSB mode
    let newColor = color(finalHue, finalSaturation, finalBrightness, a);
    pg.pixels[i] = red(newColor);
    pg.pixels[i + 1] = green(newColor);
    pg.pixels[i + 2] = blue(newColor);
    pg.pixels[i + 3] = alpha(newColor);
  }
  pg.updatePixels();

  // Store the newly created graphics buffer in the cache
  recoloredImageCache[cacheKey] = pg;
  return pg; // Return the graphics buffer as a p5.Image object
}

// Array to hold the images for the current skeleton after recoloring
let currentSkeletonImages = {};

function draw() {
  // Check if any required asset arrays are empty before attempting to draw
  if (imgPelvisMedium.length === 0 || imgSpine.length === 0 || imgTorsoMedium.length === 0 || imgSkullsMedium.length === 0) {
    // Optionally draw a loading message or simply wait
    background(20, 20, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Loading assets...", width / 2, height / 2);
    return; // Exit draw loop until assets are loaded
  }

  background(20, 20, 40);

  // Update slider value labels
  initialAngleMinLabel.html(`Min: ${initialAngleMinSlider.value()}°`);
  initialAngleMaxLabel.html(`Max: ${initialAngleMaxSlider.value()}°`);
  initialIntensityMinLabel.html(`Min: ${initialIntensityMinSlider.value()}`);
  initialIntensityMaxLabel.html(`Max: ${initialIntensityMaxSlider.value()}`);
  terminalAngleMinLabel.html(`Min: ${terminalAngleMinSlider.value()}°`);
  terminalAngleMaxLabel.html(`Max: ${terminalAngleMaxSlider.value()}°`);
  terminalIntensityMinLabel.html(`Min: ${terminalIntensityMinSlider.value()}`);
  terminalIntensityMaxLabel.html(`Max: ${terminalIntensityMaxSlider.value()}`);
  verticalDispMinLabel.html(`Min: ${verticalDispMinSlider.value()}`);
  verticalDispMaxLabel.html(`Max: ${verticalDispMaxSlider.value()}`);
  // UPDATED: Update labels for new min/max point position sliders
  point1PosMinLabel.html(`Min: ${nfc(point1PosMinSlider.value(), 2)}`);
  point1PosMaxLabel.html(`Max: ${nfc(point1PosMaxSlider.value(), 2)}`);
  point2PosMinLabel.html(`Min: ${nfc(point2PosMinSlider.value(), 2)}`);
  point2PosMaxLabel.html(`Max: ${nfc(point2PosMaxSlider.value(), 2)}`);
  terminalPointXMinLabel.html(`Min: ${terminalPointXMinSlider.value()}`); // Update min label for new slider
  terminalPointXMaxLabel.html(`Max: ${terminalPointXMaxSlider.value()}`); // Update max label for new slider
  headXOffsetMinLabel.html(`Min: ${headXOffsetMinSlider.value()}`);
  headXOffsetMaxLabel.html(`Max: ${headXOffsetMaxSlider.value()}`);
  overallScaleMinLabel.html(`Min: ${nfc(overallScaleMinSlider.value(), 2)}x`);
  overallScaleMaxLabel.html(`Max: ${nfc(overallScaleMaxSlider.value(), 2)}x`);
  greenHueMinLabel.html(`Min: ${greenHueMinSlider.value()}°`); // NEW: Update green hue min label
  greenHueMaxLabel.html(`Max: ${greenHueMaxSlider.value()}°`); // NEW: Update green hue max label
  greenSaturationMinLabel.html(`Min: ${greenSaturationMinSlider.value()}%`); // NEW: Update green saturation min label
  greenSaturationMaxLabel.html(`Max: ${greenSaturationMaxSlider.value()}%`); // NEW: Update green saturation max label
  greenBrightnessMinLabel.html(`Min: ${greenBrightnessMinSlider.value()}%`); // NEW: Update green brightness min label
  greenBrightnessMaxLabel.html(`Max: ${greenBrightnessMaxSlider.value()}%`); // NEW: Update green brightness max label
  generalBrightnessMinLabel.html(`Min: ${generalBrightnessMinSlider.value()}%`); // NEW: Update general brightness min label
  generalBrightnessMaxLabel.html(`Max: ${generalBrightnessMaxSlider.value()}%`); // NEW: Update general brightness max label

  let collisionDetected = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  // Get slider values for ranges
  let initialAngleMin = initialAngleMinSlider.value();
  let initialAngleMax = initialAngleMaxSlider.value();
  let initialIntensityMin = initialIntensityMinSlider.value();
  let initialIntensityMax = initialIntensityMaxSlider.value();
  let terminalAngleMin = terminalAngleMinSlider.value();
  let terminalAngleMax = terminalAngleMaxSlider.value();
  let terminalIntensityMin = terminalIntensityMinSlider.value();
  let terminalIntensityMax = terminalIntensityMaxSlider.value();

  // Update bezier length min/max from sliders
  bezierLengthMin = verticalDispMinSlider.value();
  bezierLengthMax = verticalDispMaxSlider.value();

  // UPDATED: Get randomized tPoint1 and tPoint2 values from the new min/max sliders
  tPoint1 = random(point1PosMinSlider.value(), point1PosMaxSlider.value());
  tPoint2 = random(point2PosMinSlider.value(), point2PosMaxSlider.value());

  // Get min/max for terminalPointX and randomize
  let terminalPointXMin = terminalPointXMinSlider.value();
  let terminalPointXMax = terminalPointXMaxSlider.value(); 

  // Get min/max for headXOffset and randomize
  let headXOffsetMin = headXOffsetMinSlider.value();
  let headXOffsetMax = headXOffsetMaxSlider.value();

  // NEW: Get min/max for green hue and randomize
  let greenHueMin = greenHueMinSlider.value();
  let greenHueMax = greenHueMaxSlider.value();
  // NEW: Get min/max for green saturation and randomize
  let greenSaturationMin = greenSaturationMinSlider.value();
  let greenSaturationMax = greenSaturationMaxSlider.value();
  // NEW: Get min/max for green brightness and randomize
  let greenBrightnessMin = greenBrightnessMinSlider.value();
  let greenBrightnessMax = greenBrightnessMaxSlider.value();
  // NEW: Get min/max for general brightness and randomize
  let generalBrightnessMin = generalBrightnessMinSlider.value();
  let generalBrightnessMax = generalBrightnessMaxSlider.value();

  // NEW: Random rotation for blades
  let bladeRandomRotation = random(radians(-30), radians(30)); // Convert degrees to radians

  do {
    collisionDetected = false;
    attempts++;

    // NEW: Choose a random green hue, saturation, and brightness for the skeleton's green parts
    currentSkeletonGreenHue = random(greenHueMin, greenHueMax);
    currentSkeletonGreenSaturation = random(greenSaturationMin, greenSaturationMax);
    currentSkeletonGreenBrightness = random(greenBrightnessMin, greenBrightnessMax);
    // NEW: Choose a random general brightness for the entire skeleton
    currentSkeletonGeneralBrightness = random(generalBrightnessMin, generalBrightnessMax);

    // Select new random images for THIS attempt
    // And process them immediately after selection with all brightness parameters
    currentSkeletonImages.spine = imgSpine.length > 0 ? processSkeletonImage(random(imgSpine), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.bladeFront = imgBlades.length > 0 ? processSkeletonImage(random(imgBlades), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.bladeBack = imgBlades.length > 0 ? processSkeletonImage(random(imgBlades), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;

    // Define possible arm combos
    const armCombos = [];
    if (imgArmsBack_1h.length > 0 && imgArmsFrontIdle.length > 0) armCombos.push({ back: imgArmsBack_1h, front: imgArmsFrontIdle });
    if (imgArmsBack_1h.length > 0 && imgArmsFrontExpress.length > 0) armCombos.push({ back: imgArmsBack_1h, front: imgArmsFrontExpress });
    if (imgArmsBack_1h.length > 0 && imgArmsFrontInteract.length > 0) armCombos.push({ back: imgArmsBack_1h, front: imgArmsFrontInteract });
    if (imgArmsBackHello.length > 0 && imgArmsFrontPhone.length > 0) armCombos.push({ back: imgArmsBackHello, front: imgArmsFrontPhone });
    
    // Randomly choose one combo
    const chosenCombo = armCombos.length > 0 ? random(armCombos) : { back: [], front: [] };
    
    // Assign the arms based on the chosen combo and process them
    currentSkeletonImages.armBack = chosenCombo.back.length > 0 ? processSkeletonImage(random(chosenCombo.back), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.armFrontIdle = chosenCombo.front.length > 0 ? processSkeletonImage(random(chosenCombo.front), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;


    // Select pelvis based on size category and process
    let pelvisSizeChoice = floor(random(3)); // 0: small, 1: medium, 2: large
    if (pelvisSizeChoice === 0 && imgPelvisSmall.length > 0) {
      currentSkeletonImages.pelvis = processSkeletonImage(random(imgPelvisSmall), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentPelvisSize = "small";
    } else if (pelvisSizeChoice === 1 && imgPelvisMedium.length > 0) {
      currentSkeletonImages.pelvis = processSkeletonImage(random(imgPelvisMedium), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentPelvisSize = "medium";
    } else if (imgPelvisLarge.length > 0) {
      currentSkeletonImages.pelvis = processSkeletonImage(random(imgPelvisLarge), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentPelvisSize = "large";
    } else {
      currentSkeletonImages.pelvis = null;
      currentPelvisSize = "medium"; // Fallback size
    }

    // Select torso based on size category (NEW) and process
    let torsoSizeChoice = floor(random(3)); // 0: small, 1: medium, 2: large
    if (torsoSizeChoice === 0 && imgTorsoSmall.length > 0) {
      currentSkeletonImages.torso = processSkeletonImage(random(imgTorsoSmall), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentTorsoSize = "small";
    } else if (torsoSizeChoice === 1 && imgTorsoMedium.length > 0) {
      currentSkeletonImages.torso = processSkeletonImage(random(imgTorsoMedium), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentTorsoSize = "medium";
    } else if (imgTorsoLarge.length > 0) {
      currentSkeletonImages.torso = processSkeletonImage(random(imgTorsoLarge), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentTorsoSize = "large";
    } else {
      currentSkeletonImages.torso = null;
      currentTorsoSize = "medium"; // Fallback size
    }

    // NEW: Select skull based on size category and set currentSkullSize, then process
    let skullSizeChoice = floor(random(3)); // 0: small, 1: medium, 2: large
    let selectedSkullArray;
    if (skullSizeChoice === 0 && imgSkullsSmall.length > 0) {
      selectedSkullArray = imgSkullsSmall;
      currentSkullSize = "small";
    } else if (skullSizeChoice === 1 && imgSkullsMedium.length > 0) {
      selectedSkullArray = imgSkullsMedium;
      currentSkullSize = "medium";
    } else if (imgSkullsLarge.length > 0) {
      selectedSkullArray = imgSkullsLarge;
      currentSkullSize = "large";
    } else {
      selectedSkullArray = [];
      currentSkullSize = "medium"; // Fallback size
    }

    // Select head elements independently for more variation and process
    currentSkeletonImages.skull = selectedSkullArray.length > 0 ? processSkeletonImage(random(selectedSkullArray), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.jaw = imgJaws.length > 0 ? processSkeletonImage(random(imgJaws), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.nose = imgNoses.length > 0 ? processSkeletonImage(random(imgNoses), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.eye = imgEyes.length > 0 ? processSkeletonImage(random(imgEyes), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;
    currentSkeletonImages.pupil = imgPupils.length > 0 ? processSkeletonImage(random(imgPupils), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;

    // Select mark image independently for more variation and process
    currentSkeletonImages.mark = imgMarks.length > 0 ? processSkeletonImage(random(imgMarks), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness) : null;

    // Select leg images based on the chosen pelvis size (UPDATED) and process
    if (currentPelvisSize === "small" && imgLegsBackSmall.length > 0 && imgLegsFrontSmall.length > 0) {
      currentSkeletonImages.legBack = processSkeletonImage(random(imgLegsBackSmall), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentSkeletonImages.legFront = processSkeletonImage(random(imgLegsFrontSmall), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
    } else if (currentPelvisSize === "medium" && imgLegsBackMedium.length > 0 && imgLegsFrontMedium.length > 0) {
      currentSkeletonImages.legBack = processSkeletonImage(random(imgLegsBackMedium), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentSkeletonImages.legFront = processSkeletonImage(random(imgLegsFrontMedium), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
    } else if (currentPelvisSize === "large" && imgLegsBackLarge.length > 0 && imgLegsFrontLarge.length > 0) {
      currentSkeletonImages.legBack = processSkeletonImage(random(imgLegsBackLarge), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
      currentSkeletonImages.legFront = processSkeletonImage(random(imgLegsFrontLarge), currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness, currentSkeletonGeneralBrightness);
    } else {
      currentSkeletonImages.legBack = null;
      currentSkeletonImages.legFront = null;
    }

    // Adjust markOffsetY based on currentSkullSize
    markOffsetY = -150 + markHeightAdjustments[currentSkullSize];

    // Get the current overall scale value (randomized from min/max sliders)
    currentOverallScale = random(overallScaleMinSlider.value(), overallScaleMaxSlider.value());

    // Calculate yOffset based on leg size, using the new compensation variable
    let yOffsetForLegSize = characterYOffsetByLegSize[currentPelvisSize];

    // Generate random values within the specified ranges
    initialAngle = random(initialAngleMin, initialAngleMax);
    initialIntensity = random(initialIntensityMin, initialIntensityMax);
    terminalAngle = random(terminalAngleMin, terminalAngleMax);
    terminalIntensity = random(terminalIntensityMin, terminalIntensityMax);
    randomVerticalLength = random(bezierLengthMin, bezierLengthMax);

    // Calculate head rotation with higher probability in the middle
    // Averaging two random numbers creates a triangular distribution, peaking in the middle
    headRotationAngle = (random(-30, 30) + random(-30, 30)) / 2;

    // Assign randomized values for info panel display
    terminalPointXOffset = random(terminalPointXMin, terminalPointXMax);
    headXOffset = random(headXOffsetMin, headXOffsetMax);
    // Head random scale factor: -20% to +20% of original size (0.8 to 1.2 scale)
    headRandomScaleFactor = random(0.8, 1.2);
    // NEW: Pelvis random scale factor: -20% to +20% of original size (0.8 to 1.2 scale)
    pelvisRandomScaleFactor = random(0.8, 1.2);
    // NEW: Torso random scale factor: -20% to +20% of original size (0.8 to 1.2 scale)
    torsoRandomScaleFactor = random(0.8, 1.2);

    // Define points for the bezier curve, applying overall scale
    x1 = 0;
    // Apply the yOffsetForLegSize directly here, scaled by currentOverallScale
    y1 = ((height / 4) + yOffsetForLegSize) * currentOverallScale;

    let padding = 50 * currentOverallScale; // Scale padding
    let minCanvasX = -width / 2 + padding;
    let maxCanvasX = width / 2 - padding;
    let minCanvasY = -height / 2 + padding;

    // x2 is the horizontal position of the terminal point, relative to canvas center
    // Now influenced by the new slider and overall scale
    x2 = terminalPointXOffset * currentOverallScale; // Use the randomized value and scale

    // y2 is the vertical position of the terminal point.
    // It's 'randomVerticalLength' units *above* y1 (so y1 - randomVerticalLength)
    y2 = y1 - (randomVerticalLength * currentOverallScale); // Scale randomVerticalLength

    // Ensure y2 stays within reasonable vertical bounds relative to the canvas center
    // It shouldn't go too high (more negative than minCanvasY)
    y2 = max(y2, minCanvasY);
    // It shouldn't go too low (less negative than, say, y1 - 50, to keep it above the pelvis by a minimum amount)
    y2 = min(y2, y1 - (50 * currentOverallScale)); // Scale the 50 offset

    // Define control points, applying overall scale to intensities
    cx1 = x1 + (initialIntensity * cos(radians(initialAngle))) * currentOverallScale;
    cy1 = y1 + (initialIntensity * sin(radians(initialAngle))) * currentOverallScale;
    cx2 = x2 - (terminalIntensity * cos(radians(terminalAngle))) * currentOverallScale;
    cy2 = y2 - (terminalIntensity * sin(radians(terminalAngle))) * currentOverallScale;

    // Calculate the actual points on the curve
    p1x = bezierPoint(x1, cx1, cx2, x2, 0);
    p1y = bezierPoint(y1, cy1, cy2, y2, 0);

    pPoint1X = bezierPoint(x1, cx1, cx2, x2, tPoint1);
    pPoint1Y = bezierPoint(y1, cy1, cy2, y2, tPoint1);

    pPoint2X = bezierPoint(x1, cx1, cx2, x2, tPoint2);
    pPoint2Y = bezierPoint(y1, cy1, cy2, y2, tPoint2);

    p2x = bezierPoint(x1, cx1, cx2, x2, 1);
    p2y = bezierPoint(y1, cy1, cy2, y2, 1);

    // Calculate approximate radii for collision detection (now assigned to global variables)
    // Add null checks before accessing .width or .height
    rPelvis = currentSkeletonImages.pelvis ? (currentSkeletonImages.pelvis.width / 2) * currentOverallScale * pelvisRandomScaleFactor * 0.50 : 0;
    rSpine = currentSkeletonImages.spine ? (max(currentSkeletonImages.spine.width, currentSkeletonImages.spine.height) / 2) * currentOverallScale * 0.16 : 0;
    // Torso radius now factors in torsoRandomScaleFactor
    rTorso = currentSkeletonImages.torso ? (max(currentSkeletonImages.torso.width, currentSkeletonImages.torso.height) / 2) * currentOverallScale * torsoRandomScaleFactor * 0.60 : 0;
    if (currentTorsoSize === "large") {
      rTorso *= 1.25; // Increase by 25% when torso is large
    }
    rSkull = currentSkeletonImages.skull ? (max(currentSkeletonImages.skull.width, currentSkeletonImages.skull.height) / 2) * currentOverallScale * headRandomScaleFactor * 0.50 : 0;
    rBlade = currentSkeletonImages.bladeFront ? (max(currentSkeletonImages.bladeFront.width, currentSkeletonImages.bladeFront.height) / 2) * currentOverallScale * 0.50 : 0;

    if (collisionDetectionCheckbox.checked()) {
      // Check for collisions between consecutive body parts (excluding head elements)
      if (rPelvis > 0 && rSpine > 0 && dist(p1x, p1y, pPoint1X, pPoint1Y) < (rPelvis + rSpine) * COLLISION_OVERLAP_FACTOR + COLLISION_PIXEL_BUFFER) {
        collisionDetected = true;
      }
      // Apply specific stricter buffer for spine-torso collision
      if (!collisionDetected && rSpine > 0 && rTorso > 0 && dist(pPoint1X, pPoint1Y, pPoint2X, pPoint2Y) < (rSpine + rTorso) * COLLISION_OVERLAP_FACTOR + SPINE_TORSO_COLLISION_BUFFER) {
        collisionDetected = true;
      }
      // Removed: collision check between torso and skull
    }

  } while (collisionDetected && attempts < MAX_ATTEMPTS);

  if (attempts >= MAX_ATTEMPTS) {
    console.warn("Max attempts reached for collision avoidance. Some assets might be overlapping. Try adjusting slider ranges or turning off collision detection.");
  }

  push();
  translate(width / 2, height / 2);

  // Get the current overall scale value
  // currentOverallScale is already randomized in the do-while loop

  // Calculate tangent and perpendicular for Point 2 (needed for blades and arms)
  let tangentX_p2 = bezierTangent(x1, cx1, cx2, x2, tPoint2);
  let tangentY_p2 = bezierTangent(y1, cy1, cy2, y2, tPoint2);

  let perpX_p2 = -tangentY_p2;
  let perpY_p2 = tangentX_p2;

  let mag_p2 = sqrt(perpX_p2 * perpX_p2 + perpY_p2 * perpY_p2);
  if (mag_p2 === 0) {
    perpX_p2 = 1;
    perpY_p2 = 0;
    mag_p2 = 1;
  }
  let normPerpX_p2 = perpX_p2 / mag_p2;
  let normPerpY_p2 = perpY_p2 / mag_p2;

  // Tangent for the initial point (for image rotation) - calculated here to be accessible for point marker
  let tangentX_initial = bezierTangent(x1, cx1, cx2, x2, 0);
  let tangentY_initial = bezierTangent(y1, cy1, cy2, y2, 0);

  // Tangent for Point 1 (for image rotation)
  let tangentX_p1 = bezierTangent(x1, cx1, cx2, x2, tPoint1);
  let tangentY_p1 = bezierTangent(y1, cy1, cy2, y2, tPoint1);

  if (showDebugElementsCheckbox.checked()) {
    // Draw the bezier curve
    stroke(200, 200, 255);
    strokeWeight(3);
    noFill();
    // Bezier coordinates are already scaled in the calculation above
    bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

    // --- Draw the perpendicular line at the terminal point ---
    let lineLength = random(50, 100) * currentOverallScale; // Scale line length
    let halfLineLength = lineLength / 2;

    // Get the tangent vector at the terminal point (t=1)
    let tangentX_terminal = x2 - cx2;
    let tangentY_terminal = y2 - cy2;

    // Calculate a perpendicular vector (-dy, dx)
    let perpX_terminal = -tangentY_terminal;
    let perpY_terminal = tangentX_terminal;

    // Normalize the perpendicular vector
    let mag_terminal = sqrt(perpX_terminal * perpX_terminal + perpY_terminal * perpY_terminal);
    if (mag_terminal === 0) {
      perpX_terminal = 1;
      perpY_terminal = 0;
      mag_terminal = 1;
    }
    let normPerpX_terminal = perpX_terminal / mag_terminal;
    let normPerpY_terminal = perpY_terminal / mag_terminal;

    // Scale the normalized perpendicular vector to half the desired line length
    let scaledPerpX_terminal = normPerpX_terminal * halfLineLength;
    let scaledPerpY_terminal = normPerpY_terminal * halfLineLength;

    // Calculate the endpoints of the perpendicular line
    let lineStartX_terminal = p2x - scaledPerpX_terminal;
    let lineStartY_terminal = p2y - scaledPerpY_terminal;
    let lineEndX_terminal = p2x + scaledPerpX_terminal;
    let lineEndY_terminal = p2y + scaledPerpY_terminal;

    // Draw the perpendicular line for terminal point
    stroke(50, 50, 255);
    strokeWeight(2);
    line(lineStartX_terminal, lineStartY_terminal, lineEndX_terminal, lineEndY_terminal);

    // --- Draw the perpendicular line at Point 2 ---
    // Use the already calculated normPerpX_p2 and normPerpY_p2
    let scaledPerpX_p2 = normPerpX_p2 * lineLength * 2;
    let scaledPerpY_p2 = normPerpY_p2 * lineLength * 2;

    // Calculate the endpoints of the perpendicular line for Point 2
    let lineStartX_p2 = pPoint2X - scaledPerpX_p2;
    let lineStartY_p2 = pPoint2Y - scaledPerpY_p2;
    let lineEndX_p2 = pPoint2X + scaledPerpX_p2;
    let lineEndY_p2 = pPoint2Y + scaledPerpY_p2;

    // Draw the perpendicular line for Point 2
    stroke(255, 140, 0);
    strokeWeight(2);
    line(lineStartX_p2, lineStartY_p2, lineEndX_p2, lineEndY_p2);

    // --- Draw the perpendicular line at Point 1 ---
    let perpX_p1 = -tangentY_p1;
    let perpY_p1 = tangentX_p1;

    let mag_p1 = sqrt(perpX_p1 * perpX_p1 + perpY_p1 * perpY_p1);
    if (mag_p1 === 0) {
      perpX_p1 = 1;
      perpY_p1 = 0;
      mag_p1 = 1;
    }
    let normPerpX_p1 = perpX_p1 / mag_p1;
    let normPerpY_p1 = perpY_p1 / mag_p1;

    let scaledPerpX_p1 = normPerpX_p1 * halfLineLength;
    let scaledPerpY_p1 = normPerpY_p1 * halfLineLength;

    stroke(255, 255, 50);
    strokeWeight(2);
    line(pPoint1X - scaledPerpX_p1, pPoint1Y - scaledPerpY_p1, pPoint1X + scaledPerpX_p1, pPoint1Y + scaledPerpY_p1);

    // Circle properties
    let baseCircleSize = 15 * currentOverallScale; // Scale circle size
    let glowSize = baseCircleSize * 2.5;
    let glowAlpha = map(sin(frameCount * 0.05), -1, 1, 30, 100);

    noStroke();

    colorMode(RGB, 255, 255, 255, 255); // Temporarily switch to RGB for debug colors

    // Initial point (Red) - Circle and Perpendicular line (always drawn as point markers)
    fill(255, 0, 0, glowAlpha);
    ellipse(p1x, p1y, glowSize, glowSize);
    fill(255, 0, 0);
    ellipse(p1x, p1y, baseCircleSize, baseCircleSize);

    let perpX_initial = -tangentY_initial;
    let perpY_initial = tangentX_initial;

    let mag_initial = sqrt(perpX_initial * perpX_initial + perpY_initial * perpY_initial);
    if (mag_initial === 0) {
      perpX_initial = 1;
      perpY_initial = 0;
      mag_initial = 1;
    }
    let normPerpX_initial = perpX_initial / mag_initial;
    let normPerpY_initial = perpY_initial / mag_initial;

    let scaledPerpX_initial = normPerpX_initial * halfLineLength;
    let scaledPerpY_initial = normPerpY_initial * halfLineLength;

    stroke(255, 0, 0);
    strokeWeight(2);
    line(p1x - scaledPerpX_initial, p1y - scaledPerpY_initial, p1x + scaledPerpX_initial, p1y + scaledPerpY_initial);


    // Draw collision detection circles if checkbox is checked
    if (collisionDetectionCheckbox.checked()) {
      push();
      noFill();
      stroke(255, 0, 255);
      strokeWeight(2);

      // Pelvis collision circle
      if (rPelvis > 0) ellipse(p1x, p1y + (80 * currentOverallScale), rPelvis * 2, rPelvis * 2); // Scale offset

      // Spine collision circle
      if (rSpine > 0) ellipse(pPoint1X, pPoint1Y, rSpine * 2, rSpine * 2);

      // Torso collision circle
      if (rTorso > 0) {
        let effectiveTorsoCollisionOffsetY = 0;
        if (currentTorsoSize === "large") {
          effectiveTorsoCollisionOffsetY = torsoCollisionOffsetYLarge * currentOverallScale;
        }
        ellipse(pPoint2X, pPoint2Y + effectiveTorsoCollisionOffsetY, rTorso * 2, rTorso * 2);
      }

      // Skull/Head collision circle (still drawn for visual reference, but not part of collision logic)
      if (rSkull > 0) ellipse(p2x, p2y, rSkull * 2, rSkull * 2);

      // Blade collision circle (for visual reference) for bladeFront
      if (rBlade > 0) {
        let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
        let bladeFrontApproxX = pPoint2X + normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset;
        let bladeFrontApproxY = pPoint2Y + normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset;
        ellipse(bladeFrontApproxX, bladeFrontApproxY, rBlade * 2, rBlade * 2);
      }

      // Blade collision circle (for visual reference) for bladeBack
      if (rBlade > 0) {
        let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
        let bladeBackApproxX = pPoint2X + normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset;
        let bladeBackApproxY = pPoint2Y + normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset;
        ellipse(bladeBackApproxX, bladeBackApproxY, rBlade * 2, rBlade * 2);
      }

      pop();
    }

    // Terminal point (blue) - Circle (kept for visual reference on the point)
    fill(100, 100, 255, glowAlpha);
    ellipse(p2x, p2y, glowSize, glowSize);
    fill(50, 50, 255);
    ellipse(p2x, p2y, baseCircleSize, baseCircleSize);
    colorMode(HSB, 360, 100, 100, 255); // Switch back to HSB for skeleton drawing
  }

  // Only draw body parts if no collision detected OR if collision detection is turned off
  if (!collisionDetected || !collisionDetectionCheckbox.checked()) {

    // Safely calculate required compensations if images exist
    let pelvisScaleCompensationX = 0;
    let pelvisOffsetYCompensation = 0;
    if (currentSkeletonImages.pelvis) {
      // Calculate the X offset compensation for pelvis scaling (only on X-axis)
      pelvisScaleCompensationX = (currentSkeletonImages.pelvis.width / 2) * currentOverallScale * (pelvisRandomScaleFactor - 1);
      // Apply the new compensation factor to reduce its effect
      pelvisScaleCompensationX *= PELVIS_LEG_X_COMPENSATION_FACTOR;
      // Calculate the Y offset for pelvis to compensate for X-axis scaling
      pelvisOffsetYCompensation = (currentSkeletonImages.pelvis.height * currentOverallScale * (pelvisRandomScaleFactor - 1)) / 2;
      // Apply the new compensation factor to reduce its effect
      pelvisOffsetYCompensation *= PELVIS_Y_COMPENSATION_FACTOR; // NEW: Apply Y compensation factor
    }

    let torsoScaleCompensationX = 0;
    if (currentSkeletonImages.torso) {
      // Calculate the X offset compensation for torso scaling (only on X-axis)
      // If torso scales up, blades move outwards. If scales down, inwards.
      torsoScaleCompensationX = (currentSkeletonImages.torso.width / 2) * currentOverallScale * (torsoRandomScaleFactor - 1);
      // Apply the tuneable compensation factor
      torsoScaleCompensationX *= bladeXCompensationFactor;
    }

    // Calculate effective leg offsets based on pelvis size, applying overall scale AND pelvis scale compensation
    let effectiveLegBackOffsetX = (baseLegBackOffsetX + legSizeAdjustments[currentPelvisSize].backX) * currentOverallScale - pelvisScaleCompensationX;
    let effectiveLegBackOffsetY = (baseLegBackOffsetY + legSizeAdjustments[currentPelvisSize].backY) * currentOverallScale;
    let effectiveLegFrontOffsetX = (baseLegFrontOffsetX + legSizeAdjustments[currentPelvisSize].frontX) * currentOverallScale + pelvisScaleCompensationX;
    let effectiveLegFrontOffsetY = (baseLegFrontOffsetY + legSizeAdjustments[currentPelvisSize].frontY) * currentOverallScale;

    // Draw the Blade Back (under torso, right side, flipped horizontally)
    if (currentSkeletonImages.bladeBack) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;

      // normPerpX_p2 and normPerpY_p2 give the direction of the perpendicular line.
      // We want to move along this line by `effectiveBladeDist` in the `bladeBackSideOffset` direction.
      let bladeBackPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset);
      let bladeBackPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset);

      translate(bladeBackPosX, bladeBackPosY);

      // Rotate the blade to align with the perpendicular line and add random rotation
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade + bladeRandomRotation);
      scale(-1, 1); // Flip horizontally AFTER rotation to maintain correct orientation relative to the line

      image(
        currentSkeletonImages.bladeBack,
        (bladeBackOffsetX + torsoScaleCompensationX * bladeBackSideOffset) * currentOverallScale, // Apply scaled offset and compensation
        bladeBackOffsetY * currentOverallScale, // Scale offset
        currentSkeletonImages.bladeBack.width * bladeBackScaleX * currentOverallScale,
        currentSkeletonImages.bladeBack.height * bladeBackScaleY * currentOverallScale
      );
      pop();
    }

    // NEW: Draw Arm Back (behind everything but the blade back)
    if (currentSkeletonImages.armBack) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
      let armBackPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset);
      let armBackPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset);

      translate(armBackPosX, armBackPosY);

      // Apply the same rotation as the back blade
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade + bladeRandomRotation);
      // No longer flipping horizontally

      image(
        currentSkeletonImages.armBack,
        (armBackOffsetX + torsoScaleCompensationX * bladeBackSideOffset) * currentOverallScale, // Apply armBackOffsetX and compensation
        armBackOffsetY * currentOverallScale, // Apply armBackOffsetY
        currentSkeletonImages.armBack.width * currentOverallScale,
        currentSkeletonImages.armBack.height * currentOverallScale
      );
      pop();
    }

    // New: Draw LegBack (behind pelvis)
    if (currentSkeletonImages.legBack) {
      push();
      translate(p1x, p1y);
      // No rotation for legs
      image(
        currentSkeletonImages.legBack,
        effectiveLegBackOffsetX,
        effectiveLegBackOffsetY,
        currentSkeletonImages.legBack.width * currentOverallScale,
        currentSkeletonImages.legBack.height * currentOverallScale
      );
      pop();
    }

    // Initial point (now an image) - Pelvis
    if (currentSkeletonImages.pelvis) {
      push();
      translate(p1x, p1y);
      // Calculate the angle for pelvis image rotation
      let anglePelvis = atan2(tangentY_initial, tangentX_initial) + HALF_PI;
      rotate(anglePelvis);

      image(
        currentSkeletonImages.pelvis,
        pelvisOffsetX * currentOverallScale,
        pelvisOffsetY * currentOverallScale - pelvisOffsetYCompensation,
        currentSkeletonImages.pelvis.width * currentOverallScale * pelvisRandomScaleFactor,
        currentSkeletonImages.pelvis.height * currentOverallScale
      );
      pop();
    }

    // New: Draw LegFront (over pelvis)
    if (currentSkeletonImages.legFront) {
      push();
      translate(p1x, p1y);
      // No rotation for legs
      image(
        currentSkeletonImages.legFront,
        effectiveLegFrontOffsetX,
        effectiveLegFrontOffsetY,
        currentSkeletonImages.legFront.width * currentOverallScale,
        currentSkeletonImages.legFront.height * currentOverallScale
      );
      pop();
    }

    // Draw Blade Front (under torso, left side, on p2 perpendicular line) - Renamed
    if (currentSkeletonImages.bladeFront) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;

      // normPerpX_p2 and normPerpY_p2 give the direction of the perpendicular line.
      // We want to move along this line by `effectiveBladeDist` in the `bladeFrontSideOffset` direction.
      let bladeFrontPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset);
      let bladeFrontPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset);

      translate(bladeFrontPosX, bladeFrontPosY);

      // Rotate the blade to align with the perpendicular line and add inverted random rotation
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade - bladeRandomRotation); // Inverted rotation for front blade

      image(
        currentSkeletonImages.bladeFront,
        (bladeFrontOffsetX + torsoScaleCompensationX * bladeFrontSideOffset) * currentOverallScale,
        bladeFrontOffsetY * currentOverallScale,
        currentSkeletonImages.bladeFront.width * bladeFrontScaleX * currentOverallScale,
        currentSkeletonImages.bladeFront.height * bladeFrontScaleY * currentOverallScale
      );
      pop();
    }

    // New Point 2 (Orange) - Now with Torso Image
    if (currentSkeletonImages.torso) {
      push();
      translate(pPoint2X, pPoint2Y);

      // Calculate the angle of the tangent at Point 2
      let angleP2 = atan2(tangentY_p2, tangentX_p2);
      rotate(angleP2 + HALF_PI);

      image(
        currentSkeletonImages.torso,
        torsoOffsetX * currentOverallScale,
        torsoOffsetY * currentOverallScale,
        currentSkeletonImages.torso.width * currentOverallScale * torsoRandomScaleFactor,
        currentSkeletonImages.torso.height * currentOverallScale * torsoRandomScaleFactor
      );
      pop();
    }

    // New Point 1 (Yellow) - Now with Spine Image (MOVED AFTER TORSO)
    if (currentSkeletonImages.spine) {
      push();
      translate(pPoint1X, pPoint1Y);

      // Calculate the angle of the tangent at Point 1
      let angleP1 = atan2(tangentY_p1, tangentX_p1);
      rotate(angleP1 + HALF_PI);

      // Draw the spine image
      image(
        currentSkeletonImages.spine,
        spineOffsetX * currentOverallScale,
        spineOffsetY * currentOverallScale,
        currentSkeletonImages.spine.width * currentOverallScale,
        currentSkeletonImages.spine.height * currentOverallScale
      );
      pop();
    }

    // Terminal point (blue) - Now with multiple assets
    if (currentSkeletonImages.skull || currentSkeletonImages.jaw || currentSkeletonImages.mark || currentSkeletonImages.nose || currentSkeletonImages.eye || currentSkeletonImages.pupil) {
      
      // Safely calculate head scale compensation if skull is present
      let headScaleCompensationY = 0;
      if (currentSkeletonImages.skull) {
        let baseSkullHeight = currentSkeletonImages.skull.height * currentOverallScale;
        headScaleCompensationY = baseSkullHeight * (headRandomScaleFactor - 1) / 2;
      }
      
      push();
      translate(p2x, p2y);

      // Apply the calculated head rotation
      rotate(radians(headRotationAngle));

      // Draw skulls
      if (currentSkeletonImages.skull) {
        image(
          currentSkeletonImages.skull,
          skullOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          skullOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.skull.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.skull.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw jaws
      if (currentSkeletonImages.jaw) {
        image(
          currentSkeletonImages.jaw,
          jawOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          jawOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.jaw.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.jaw.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw marks
      if (currentSkeletonImages.mark) {
        image(
          currentSkeletonImages.mark,
          markOffsetX * currentOverallScale + (headXOffset * currentOverallScale),
          (markOffsetY + markHeightAdjustments[currentSkullSize]) * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.mark.width * currentOverallScale * headRandomScaleFactor, // FIXED: Changed .markWidth to .width
          currentSkeletonImages.mark.height * currentOverallScale * headRandomScaleFactor // FIXED: Changed .markHeight to .height
        );
      }

      // Draw noses
      if (currentSkeletonImages.nose) {
        image(
          currentSkeletonImages.nose,
          noseOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          noseOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.nose.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.nose.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw eyes
      if (currentSkeletonImages.eye) {
        image(
          currentSkeletonImages.eye,
          eyeOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          eyeOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.eye.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.eye.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // New: Draw pupils (last head element)
      if (currentSkeletonImages.pupil) {
        image(
          currentSkeletonImages.pupil,
          pupilOffsetX * currentOverallScale + headXOffset * currentOverallScale + random(-20, 20) * currentOverallScale,
          pupilOffsetY * currentOverallScale + random(-20, 20) * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.pupil.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.pupil.height * currentOverallScale * headRandomScaleFactor
        );
      }
      pop();
    }

    // NEW: Draw Arm Front Idle (over all other elements)
    if (currentSkeletonImages.armFrontIdle) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
      let armFrontIdlePosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset);
      let armFrontIdlePosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset);

      translate(armFrontIdlePosX, armFrontIdlePosY);

      // Apply the same rotation as the front blade
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade - bladeRandomRotation); // Inverted rotation for front blade

      image(
        currentSkeletonImages.armFrontIdle,
        (armFrontOffsetX + torsoScaleCompensationX * bladeFrontSideOffset) * currentOverallScale, // Apply armFrontOffsetX and compensation
        armFrontOffsetY * currentOverallScale, // Apply armFrontOffsetY
        currentSkeletonImages.armFrontIdle.width * currentOverallScale,
        currentSkeletonImages.armFrontIdle.height * currentOverallScale
      );
      pop();
    }
  }

  pop();

  // Calculate magnitudes relative to the canvas center (before translation)
  let mag2 = dist(width / 2, height / 2, p2x + width / 2, p2y + height / 2);

  // --- Update content of the infoPanel divs ---
  // Current Randomized Values Section
  let randHtml = "<b>--- Current Randomized Values ---" + "</b><br>";
  randHtml += `Initial Angle: ${nfc(initialAngle, 2)}°<br>`;
  randHtml += `Initial Intensity: ${nfc(initialIntensity, 2)}<br>`;
  randHtml += `Terminal Angle: ${nfc(terminalAngle, 2)}°<br>`;
  randHtml += `Terminal Intensity: ${nfc(terminalIntensity, 2)}<br>`;
  randHtml += `Vertical Displacement: ${nfc(randomVerticalLength, 2)}<br>`;
  randHtml += `Point 1 Position (t-value): ${nfc(tPoint1, 2)}<br>`; // Display randomized tPoint1
  randHtml += `Point 2 Position (t-value): ${nfc(tPoint2, 2)}<br>`; // Display randomized tPoint2
  randHtml += `Overall Skeleton Scale: ${nfc(currentOverallScale, 2)}x<br>`; // UPDATED: Display randomized overall skeleton scale
  randHtml += `Terminal X Offset: ${nfc(terminalPointXOffset, 2)}<br>`;
  randHtml += `Head X Offset: ${nfc(headXOffset, 2)}<br>`;
  randHtml += `Head Random Scale: ${nfc(headRandomScaleFactor * 100, 0)}%<br>`; // UPDATED: Display head random scale factor as percentage
  randHtml += `Pelvis Random Scale: ${nfc(pelvisRandomScaleFactor * 100, 0)}%<br>`; // NEW: Display pelvis random scale factor as percentage
  randHtml += `Torso Random Scale: ${nfc(torsoRandomScaleFactor * 100, 0)}%<br>`; // NEW: Display torso random scale factor as percentage
  randHtml += `Head Rotation: ${nfc(headRotationAngle, 2)}°<br>`;
  randHtml += `Pelvis Size: ${currentPelvisSize}<br>`;
  randHtml += `Torso Size: ${currentTorsoSize}<br>`;
  randHtml += `Skull Size: ${currentSkullSize}<br>`; // NEW: Display skull size
  randHtml += `Skeleton Green Hue: ${nfc(currentSkeletonGreenHue, 0)}°<br>`; // NEW: Display current skeleton green hue
  randHtml += `Skeleton Green Saturation: ${nfc(currentSkeletonGreenSaturation, 0)}%<br>`; // NEW: Display current skeleton green saturation
  randHtml += `Skeleton Green Brightness: ${nfc(currentSkeletonGreenBrightness, 0)}%<br>`; // NEW: Display current skeleton green brightness
  randHtml += `Skeleton General Brightness: ${nfc(currentSkeletonGeneralBrightness, 0)}%<br>`; // NEW: Display current skeleton general brightness
  currentRandomizedValuesDiv.html(randHtml);

  // Curve Point Coordinates Section
  let curveHtml = "<b>--- Curve Point Coordinates ---" + "</b><br>";
  curveHtml += `Initial Point (Red):<br>`;
  curveHtml += `  X: ${nfc(p1x, 2)}, Y: ${nfc(p1y, 2)}<br>`;
  curveHtml += `Point 1 (Yellow):<br>`;
  curveHtml += `  X: ${nfc(pPoint1X, 2)}, Y: ${nfc(pPoint1Y, 2)}<br>`;
  curveHtml += `Point 2 (Orange):<br>`;
  curveHtml += `  X: ${nfc(pPoint2X, 2)}, Y: ${nfc(pPoint2Y, 2)}<br>`;
  curveHtml += `Terminal Point (Blue):<br>`;
  curveHtml += `  X: ${nfc(p2x, 2)}, Y: ${nfc(p2y, 2)}<br>`;
  curveHtml += `  Magnitude: ${nfc(mag2, 2)}<br>`;
  curvePointCoordinatesDiv.html(curveHtml);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Adjust infoPanel position on resize
  infoPanel.position(width - 270, 10);
}

// REMOVED: The hardcoded ASSET_URLS object is now replaced by the dynamically loaded assetLibraryData.