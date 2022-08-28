import * as os from 'os';
import * as readPkgUp from 'read-pkg-up';

const ifaces = os.networkInterfaces();
const destinationAddress: string = ifaces.en0.find(_item => _item.family === 'IPv4' && _item.internal === false).address;

/**
 * Уведомление микросервиса безопасности о пользовательском действии
 */

const configPromise = readPkgUp.sync();
export async function notifyUserAction (arg: {
    securityClient: any
    token: string
    action: string
    data: any
    severity: number
    eventOutcome: boolean
    message: string
    endTime: number
    sourceAddress: string
    sourceHostName: string
    filename?: string
}): Promise<void> {

    const conf = await configPromise;
    const deviceVendor: string | undefined = conf?.custom?.['device-vendor'];
    if (!deviceVendor) {
        throw new Error('Please add property "custom"."device-vendor" in package.json');
    }
    const deviceProduct: string | undefined = conf?.name;
    if (!deviceProduct) {
        throw new Error('Please add property "name" in package.json');
    }
    const deviceVersion: string | undefined = conf?.version;
    if (!deviceVersion) {
        throw new Error('Please add property "version" in package.json');
    }

    return await arg.securityClient
        .send({ cmd: 'CREATE_USER_ACTION' }, {
            token: arg.token,
            action: arg.action,
            data: arg.data,
            deviceVendor,
            deviceProduct,
            deviceVersion,
            sourceAddress: arg.sourceAddress,
            destinationAddress,
            sourceHostName: arg.sourceHostName,
            eventOutcome: arg.eventOutcome === true ? 'success' : 'failure',
            message: arg.message,
            endTime: arg.endTime,
            filename: arg?.filename,
            severity: arg.severity,
        })
        .toPromise();
}
