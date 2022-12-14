const DatabaseObject = require('./DatabaseObject')


class Polyline extends DatabaseObject
{
    /**
     * @param {array} points - Array of points like [ [x1, y1], [x2, y2, bulge]... ]
     * @param {boolean} closed
     * @param {number} startWidth
     * @param {number} endWidth
     */
    constructor(points, closed = false, nor = undefined, elevation = 0, startWidth = 0, endWidth = 0)
    {
        super(["AcDbEntity", "AcDbPolyline"])
        this.points = points;
        this.closed = closed;
        this.startWidth = startWidth;
        this.endWidth = endWidth;
        this.normal = nor;
        this.elevation = elevation;
    }

    toDxfString()
    {
        let s = `0\nLWPOLYLINE\n`;
        s += super.toDxfString()
        s += `8\n${this.layer.name}\n`;
        s += "6\nByLayer\n"
        s += "62\n256\n"
        s += "370\n-1\n"
        s += `70\n${this.closed ? 1 : 0}\n`;
        s += `90\n${this.points.length}\n`
        
        if (this.normal) {
            s += `210\n${this.normal[0]}\n220\n${this.normal[1]}\n230\n${this.normal[2]}\n`
        }

        s += `38\n${this.elevation || 0}\n`;

        for (const p of this.points) {
            s += `10\n${p[0]}\n20\n${p[1]}\n`;
            if (this.startWidth !== 0 || this.endWidth !== 0) {
                s += `40\n${this.startWidth}\n41\n${this.endWidth}\n`;
            }
            if (p[2] !== undefined) {
                s += `42\n${p[2]}\n`;
            }

        }

        s += `0\nSEQEND\n`;
        return s;
    }
}

module.exports = Polyline;
