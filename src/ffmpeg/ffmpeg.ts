const debug = require('debug')('pcap2wav:ffmpeg:index');
import { helpers } from '../helpers';

class Ffmpeg {
    public async convertToWav(codec: string, codecFile: string, wavFile: string) {
        const command = this.createConvertToWavCommand(codec, codecFile, wavFile);
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        debug(stderr, stdout);
    }

    public async mergeWavs(inputWavPaths: string, wav: string) {
        const command = `ffmpeg -i ${inputWavPaths} -filter_complex amix=inputs=2:duration=longest ${wav}`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        debug(stderr, stdout);
    }

    private createConvertToWavCommand(codec: string, codecFile: string, wavFile: string) {
        debug('createConvertToWavCommand codec:', codec);
        if (codec === 'PCMA') {
            return this.escapingBackslash(`ffmpeg -nostats -loglevel 0 -acodec pcm_alaw -f alaw -ar 8000 -i ${codecFile} -ar 8000  ${wavFile}`);
        }
        if (codec === 'PCMU') {
            return this.escapingBackslash(`ffmpeg -nostats -loglevel 0 -acodec pcm_mulaw -f mulaw -ar 8000 -i ${codecFile} -ar 8000  ${wavFile}`);
        }
        if (codec === 'G729') {
            return this.escapingBackslash(`ffmpeg -nostats -loglevel 0 -acodec g729 -f g729 -i ${codecFile} -ar 8000  ${wavFile}`);
        }
        throw Error(`cannot define convert command for codec: ${codec}`);
    }

    private escapingBackslash(input: string): string {
        return input.replace(/\\/g, '\\\\');
    }
}

const ffmpeg = new Ffmpeg();

export {
    ffmpeg,
    Ffmpeg,
};
