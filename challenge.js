/**
 * This function is to simplify the way to verify if there is the target inside the object (or parent)
 * @param {Array} parent - refers to the root
 * @param {Object} target - refers to the child that you are searching
 * @returns {boolean}
 */
function containsValue(parent, target) {
    return parent.some(child => child === target);
}

/**
 * Helper function to find the path from the root to the target node
 * @param {Object} node - current node
 * @param {Object} target - target node to find
 * @param {Array} path - current path to the target node
 * @returns {boolean}
 */
function findPath(node, target, path) {
    if (node === target) {
        path.push(node);
        return true;
    }

    if (node.children) {
        for (let child of node.children) {
            if (findPath(child, target, path)) {
                path.push(node);
                return true;
            }
        }
    }

    return false;
}

/**
 * @param {Object} fs - is root (or fileSystem abreviated)
 * @param {Object} firstTarget - is the first file/folder that is targeted
 * @param {Object} secondTarget - is the second file/folder that is targeted
 * @returns {string|null}
 * The function works the next way:
 *      - Creates 2 empty arrays to archive the shortest way to the parent.
 *      - Uses findPath to fill these arrays with the path from the root to the target nodes.
 *      - If either path is not found, it returns "Parent not found".
 *      - Reverses the paths to facilitate comparison from root to the target nodes.
 *      - Creates minLength which is used to know the shortest way between the first and second path.
 *      - Iterates over the paths up to minLength to find the highest common ancestor.
 *      - Inside the loop there is an if/else statement, it makes sure that the parent is not one of the targets.
 *      - If a common ancestor is found and it is not one of the targets, returns its name.
 *      - If no common ancestor is found or the common ancestor is one of the targets, it returns "Parent not found".
 */
function findParent(fs, firstTarget, secondTarget) {
    if (!fs || !fs.children) {
        return "Root not found";
    }

    let pathToFirst = [];
    let pathToSecond = [];

    if (!findPath(fs, firstTarget, pathToFirst) || !findPath(fs, secondTarget, pathToSecond)) {
        return "Parent not found";
    }

    pathToFirst = pathToFirst.reverse();
    pathToSecond = pathToSecond.reverse();

    let minLength = Math.min(pathToFirst.length, pathToSecond.length);

    let commonAncestor = null;
    for (let i = 0; i < minLength; i++) {
        if (pathToFirst[i] === pathToSecond[i]) {
            commonAncestor = pathToFirst[i];
        } else {
            break;
        }
    }

    // Ensure we return the highest common ancestor, not one of the targets
    if (commonAncestor === firstTarget || commonAncestor === secondTarget) {
        return commonAncestor === fs ? "Root not found" : fs.name;
    }

    return commonAncestor ? commonAncestor.name : "Parent not found";
}

class File {
    constructor(name) {
        this.children = [];
        this.name = name;
    }

    addChild(file) {
        this.children.push(file);
    }
}

/*
Example input

root ->
  a ->
    c
    d
  b    
*/

const root = new File('root');
const [a, b, c, d] = 'abcd'.split('').map(char => new File(char));

root.addChild(a);
root.addChild(b);
a.addChild(c);
a.addChild(d);

console.log(findParent(root, a, b)); //-> root
console.log('++++++++++++++++++++++++++++++++++++++');
console.log(findParent(root, c, d)); //-> a
console.log('--------------------------------------');
console.log(findParent(root, a, "b")); //-> "Parent not found"
console.log('++++++++++++++++++++++++++++++++++++++');
console.log(findParent("root", a, b)); //-> "Root not found"
console.log('--------------------------------------');
console.log(findParent(root, a, c)); //-> root
