# Track data format

## Spot marks

    spotMark : {
        id: <unique>,
        positionTrack : [
            {
                epoch : 2000,
                lat : XX,
                lon : YY,
                author : [],
                created : XXX,
                updated : YYY
            }
        ]
    }
    spotMarks of length 1 cannot be sliced.
    spotMarks must exist through the age of the slice being created.
    
## Track data

    timeTrack : [
        XXX, XX1, XX2
    ]
    