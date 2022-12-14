const DatabaseObject = require('./DatabaseObject')


const H_ALIGN_CODES = ['left', 'center', 'right'];
const V_ALIGN_CODES = ['baseline', 'bottom', 'middle', 'top'];

class Text extends DatabaseObject
{
    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     * @param {string} [horizontalAlignment="left"] left | center | right
     * @param {string} [verticalAlignment="baseline"] baseline | bottom | middle | top
     */
    constructor(x1, y1, z1, height, rotation, value, normal, horizontalAlignment = 'left', verticalAlignment = 'baseline')
    {
        super(["AcDbEntity", "AcDbText"])
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.height = height;
        this.rotation = rotation;
        this.value = value;
        this.hAlign = horizontalAlignment;
        this.vAlign = verticalAlignment;
        this.normal = normal;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/text_al_u05_c.htm
        let s = `0\nTEXT\n`;
        s += super.toDxfString()
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n${this.z1}\n`;
        s += `40\n${this.height}\n`;
        s += `1\n${this.value}\n`;
        s += `50\n${this.rotation}\n`;
        if (this.normal) {
            s += `210\n${this.normal[0]}\n220\n${this.normal[1]}\n230\n${this.normal[2]}\n`;
        }
        if (H_ALIGN_CODES.includes(this.hAlign, 1) || V_ALIGN_CODES.includes(this.vAlign, 1)) {
            s += `72\n${Math.max(H_ALIGN_CODES.indexOf(this.hAlign), 0)}\n`;
            s += `11\n${this.x1}\n21\n${this.y1}\n31\n0\n`;
            /* AutoCAD needs this one more time, yes, exactly here. */
            s += "100\nAcDbText\n";
            s += `73\n${Math.max(V_ALIGN_CODES.indexOf(this.vAlign), 0)}\n`;
        } else {
            /* AutoCAD needs this one more time. */
            s += "100\nAcDbText\n";
        }
        return s;
    }
}

module.exports = Text;
