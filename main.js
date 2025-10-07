import prompts from "prompts";
import { readdir, unlink } from "node:fs/promises";
import sharp from "sharp";

const srcFileExeptions = [".DS_Store", ".gitkeep"];
const distFileExeptions = [".gitkeep"];

async function readSrc() {
  const files = await readdir("./src");

  return files
    .filter((file) => !srcFileExeptions.includes(file))
    .map((file) => {
      const extIdx = file.lastIndexOf(".");
      const name = file.slice(0, extIdx);
      const ext = file.slice(extIdx);

      return { file, name, ext };
    });
}

async function convertToWebp(opts) {
  const files = await readSrc();
  const { sizes, ...convOpts } = opts;

  for (const { file, name } of files) {
    if (
      sizes[0] !== "" &&
      sizes[1] !== "" &&
      parseInt(sizes[0]) &&
      parseInt(sizes[1])
    ) {
      const info = await sharp(`./src/${file}`)
        .resize(parseInt(sizes[0]), parseInt(sizes[1]))
        .webp(convOpts)
        .toFile(`./dist/${name}.webp`);

      console.log(info);
    } else {
      const info = await sharp(`./src/${file}`)
        .webp(convOpts)
        .toFile(`./dist/${name}.webp`);

      console.log(info);
    }
  }
}

async function convertToAvif(opts) {
  const files = await readSrc();

  const { sizes, ...convOpts } = opts;

  for (const { file, name } of files) {
    if (
      sizes[0] !== "" &&
      sizes[1] !== "" &&
      parseInt(sizes[0]) &&
      parseInt(sizes[1])
    ) {
      const info = await sharp(`./src/${file}`)
        .resize(parseInt(sizes[0]), parseInt(sizes[1]))
        .avif(convOpts)
        .toFile(`./dist/${name}.avif`);

      console.log(info);
    } else {
      const info = await sharp(`./src/${file}`)
        .avif(convOpts)
        .toFile(`./dist/${name}.avif`);

      console.log(info);
    }
  }
}

async function convertToJpeg(opts) {
  const files = await readSrc();

  const { sizes, ...convOpts } = opts;

  for (const { file, name } of files) {
    if (
      sizes[0] !== "" &&
      sizes[1] !== "" &&
      parseInt(sizes[0]) &&
      parseInt(sizes[1])
    ) {
      const info = await sharp(`./src/${file}`)
        .resize(parseInt(sizes[0]), parseInt(sizes[1]))
        .jpeg(convOpts)
        .toFile(`./dist/${name}.jpeg`);

      console.log(info);
    } else {
      const info = await sharp(`./src/${file}`)
        .jpeg(convOpts)
        .toFile(`./dist/${name}.jpeg`);

      console.log(info);
    }
  }
}

const formatterMap = {
  webp: convertToWebp,
  avif: convertToAvif,
  jpeg: convertToJpeg,
};

const formatterQuestionsMap = {
  webp: [
    {
      type: "number",
      name: "quality",
      message: "Качество сжатия",
      initial: 85,
      min: 1,
      max: 100,
    },
    {
      type: "number",
      name: "alphaQuality",
      message: "Качество alpha слоя",
      initial: 100,
      min: 1,
      max: 100,
    },
    {
      type: "toggle",
      name: "lossless",
      message: "Использовать режим сжатия без потерь?",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "nearLossless",
      message: "Использовать режим сжатия near_lossless?",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "smartSubsample",
      message: "Использовать высококачественную субдискретизацию цветности?",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "number",
      name: "effort",
      message:
        "Загрузка процессора, от 0 (самый быстрый) до 6 (самый медленный)",
      initial: 4,
      min: 0,
      max: 6,
    },
    {
      type: "list",
      name: "sizes",
      message: "Размеры (указать ширину и высоту через пробел)",
      initial: "",
      separator: " ",
    },
  ],
  avif: [
    {
      type: "number",
      name: "quality",
      message: "Качество сжатия",
      initial: 85,
      min: 1,
      max: 100,
    },
    {
      type: "toggle",
      name: "lossless",
      message: "Использовать режим сжатия без потерь?",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "number",
      name: "effort",
      message:
        "Загрузка процессора, от 0 (самый быстрый) до 9 (самый медленный)",
      initial: 4,
      min: 0,
      max: 9,
    },
    {
      type: "select",
      name: "chromaSubsampling",
      message:
        "Установите значение «4:2:0», чтобы использовать субдискретизацию цветности",
      choices: [
        { title: "4:4:4", value: "4:4:4" },
        { title: "4:2:0", value: "4:2:0" },
      ],
      initial: 0,
    },
    {
      type: "number",
      name: "bitdepth",
      message: "Установите разрядность битов (8, 10 или 12)",
      initial: 8,
      increment: 2,
    },
    {
      type: "list",
      name: "sizes",
      message: "Размеры (указать ширину и высоту через пробел)",
      initial: "",
      separator: " ",
    },
  ],
  jpeg: [
    {
      type: "number",
      name: "quality",
      message: "Качество сжатия",
      initial: 85,
      min: 1,
      max: 100,
    },
    {
      type: "toggle",
      name: "progressive",
      message: "Использовать прогрессивную (чересстрочную) развертку",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "select",
      name: "chromaSubsampling",
      message:
        "Установите значение «4:2:0», чтобы использовать субдискретизацию цветности",
      choices: [
        { title: "4:4:4", value: "4:4:4" },
        { title: "4:2:0", value: "4:2:0" },
      ],
      initial: 0,
    },
    {
      type: "toggle",
      name: "optimizeCoding",
      message: "Оптимизировать таблицы кодирования Хаффмана",
      initial: true,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "mozjpeg",
      message: "Используйте настройки mozjpeg по умолчанию",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "trellisQuantisation",
      message: "Применить решетчатое квантование",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "overshootDeringing",
      message: "Применить подавление перерегулирования",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "toggle",
      name: "optimizeScans",
      message: "Оптимизирует прогрессивное сканирование, прогрессивные силы",
      initial: false,
      active: "да",
      inactive: "нет",
    },
    {
      type: "number",
      name: "quantisationTable",
      message: "Используемая таблица квантования (0-8)",
      initial: 0,
      min: 0,
      max: 8,
    },
    {
      type: "list",
      name: "sizes",
      message: "Размеры (указать ширину и высоту через пробел)",
      initial: "",
      separator: " ",
    },
  ],
};

async function init() {
  const promptsFormatResponse = await prompts([
    {
      type: "select",
      name: "value",
      message: "Выберите формат изображений",
      choices: [
        {
          title: "Webp",
          value: "webp",
        },
        {
          title: "Avif",
          value: "avif",
        },
        {
          title: "Jpeg",
          value: "jpeg",
        },
      ],
    },
  ]);

  const formatterOpts = await prompts(
    formatterQuestionsMap[promptsFormatResponse.value]
  );

  const distFiles = await readdir("./dist");

  distFiles
    .filter((file) => !distFileExeptions.includes(file))
    .forEach((file) => unlink(`./dist/${file}`));

  formatterMap[promptsFormatResponse.value](formatterOpts);
}

init();
