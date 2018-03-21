import oasp4fn from '@oasp/oasp4fn';
import { HttpEvent, Context } from '../../types';

oasp4fn.config({path: 'your_post_path'});
export async function postTemplate (event: HttpEvent, context: Context, callback: Function) {

}