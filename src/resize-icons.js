import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputPath = path.resolve(__dirname, '../public/icons/icon.png')
const outputDir = path.resolve(__dirname, '../public/icons')

const sizes = [16, 32, 48, 128]

const generateIcons = async () => {
    try {
        await fs.mkdir(outputDir, { recursive: true })

        await Promise.all(
            sizes.map(async (size) => {
                const outputPath = path.join(outputDir, `icon-${size}.png`)
                await sharp(inputPath)
                    .resize(size, size)
                    .toFile(outputPath)
                console.log(`Создано: ${outputPath}`)
            })
        )
    } catch (error) {
        console.error('Ошибка генерации иконок:', error)
    }
}

generateIcons()
