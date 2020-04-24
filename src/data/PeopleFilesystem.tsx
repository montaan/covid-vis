import {
  Filesystem,
  FSDirEntry,
  createDir,
  createFile,
  getPathEntry
} from "../Montaan/Filesystems";

export default class PeopleFilesystem extends Filesystem {
  startIndex: number;
  count: number;
  covidCount: number;
  caseMultiplier: number;

  constructor(
    startIndex: number,
    count: number,
    covidCount: number,
    caseMultiplier: number
  ) {
    super(undefined);
    this.startIndex = startIndex;
    this.count = count;
    this.covidCount = covidCount;
    this.caseMultiplier = caseMultiplier;
  }

  async readDir(path: string): Promise<FSDirEntry | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tree = new FSDirEntry();
        const segments = path.split("/");
        if (segments.length === 1) {
          for (
            let i = this.startIndex, l = this.startIndex + this.count, j = 0;
            i < l;
            i += 10, j += 10
          ) {
            const tenEntry = createDir(tree, i.toString());
            tenEntry.color = j < this.covidCount ? [0.5, 0, 0] : [0, 0, 0];
          }
        } else if (segments.length === 2) {
          for (
            let i = parseInt(segments[1]),
              l = this.startIndex + this.count,
              j = i - this.startIndex,
              k = 0;
            i < l && k < 10;
            i++, j++, k++
          ) {
            const personEntry = createFile(tree, i.toString());
            personEntry.color =
              j < this.covidCount
                ? [0.75, 0, 0]
                : j < this.covidCount * this.caseMultiplier
                ? [0.5, 0.5, 0]
                : [0, 0, 0];
            // 		0.65 + 0.35 * Math.sin(i * 0.2),
            // 		0.65 + 0.35 * Math.cos(i * 0.17418),
            // 		0.65 + 0.35 * Math.sin(i * 0.041),
            //   ];
          }
        }
        resolve(tree);
      }, 5 + 10 * Math.random());
    });
  }

  okResponses = ["o_o", "^_^", "~_^", "@_@", "o_~", "~_o", "T_T", ">_<", "^.^"];
  caseResponses = ["=_=", "-,-", "U_U", "-_-", "._.", "+_+", "o.o", "\\o/"];
  async readFile(path: string) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      setTimeout(() => {
        let response = this.okResponses[
          Math.floor(Math.random() * this.okResponses.length)
        ];
        if (this.mountPoint) {
          const fsEntry = getPathEntry(this.mountPoint, path);
          if (fsEntry && fsEntry.color && fsEntry.color[0] > 0) {
            response = this.caseResponses[
              Math.floor(Math.random() * this.caseResponses.length)
            ];
          }
        }
        resolve(new TextEncoder().encode(response).buffer);
      }, 10);
    });
  }
}
