/** 
 * Image comparison program written for NodeJS.
 * Uses the pixelmatch image comparison library.
 * Make sure to run {@code} npm install pixelmatch.
 * @author CP3108 AY17/18 Rune Migration Team
 * @version CP3108 AY17/18 Rune Auto-grading System v1.0
 */

/* Load modules and dependencies. */
const fs = require('fs'), // File System Module
      PNG = require('pngjs').PNG, // PNG decoder
      pixelmatch = require('pixelmatch'); // pixelmatch library

/* Image directories. (Consider replacing with script/regex to auto-fill directories.)*/
var images = 
  {
    twoD: [
            '2d_ex1/stack_2_rcrossbb_ex1.png', 
            '2d_ex1/flip_horiz(repeat_pattern(1, quarter_turn_left, (beside(rcross_bb, rcross_bb))))_ex1.png',
            '2d_ex2/beside(stack(sail_bb, sail_bb), stack(corner_bb, corner_bb))_ex2.png',
            '2d_ex2/stack(beside(sail_bb, corner_bb), beside(sail_bb, corner_bb))_ex2.png'
          ],
    threeD: [
              '3d_ex1/overlay(overlay(rcross_bb, pentagram_bb), heart_bb)_ex1.png',
              '3d_ex1/overlay(rcross_bb, overlay(pentagram_bb, heart_bb))_ex1.png',
              '3d_ex2/anaglyph(overlay(scale(0.8, heart_bb), circle_bb))_ex2-1.png',
              '3d_ex2/anaglyph(overlay(scale(0.8, heart_bb), circle_bb))_ex2-2.png',
              '3d_ex3/anaglyph(overlay(scale(0.5, pentagram_bb), heart_bb))_ex3.png',
              '3d_ex3/anaglyph(overlay(scale(0.49, pentagram_bb), heart_bb))_ex3.png'
            ]
  };


/* Load images. (Consider changing variable names to model_ans & student_ans.) */
const img1_dir = images.twoD[0];
const img2_dir = images.twoD[1];

// const img1_dir = images.threeD[4]; // Uncomment for 3D image comparison.
// const img2_dir = images.threeD[5];

/* Parse images and process them. */
var img1 = fs
      .createReadStream(img1_dir)
      .pipe(new PNG())
      .on('parsed', doneReading),
    img2 = fs
      .createReadStream(img2_dir)
      .pipe(new PNG())
      .on('parsed', doneReading),
    filesRead = 0;

/**
 * Compares images, tells whether they are the same or different, and returns a 
 * diff image, in which colored regions represent the mismatch regions.
 */ 
function doneReading() {
    // Compare only when all (2) images have been read
    if (++filesRead < 2) return;

    // Create a new PNG canvas for the diff image
    var diff = new PNG({width: img1.width, height: img1.height});

    // Compare images and get the number of different pixels
    var numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, 
      img1.height, {threshold: 0.1});

    // Log the result of comparison
    var result = numDiffPixels == 0 ? "SAME" : "DIFFERENT";
    console.log(result);
    
    // Write the diff image
    diff.pack().pipe(fs.createWriteStream('diff.png'));
}