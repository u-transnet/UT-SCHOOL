/**
 * Created by superpchelka on 24.02.18.
 */

import StudentApi from './StudentApi';
import TeacherApi from './TeacherApi';
import {Api as SchoolApi} from '../api/Api';
import {generatePrograms} from './ProgramsGenerator'

class Api{

    static programs = [
        {
            command: {
                name: 'setPrivateKey',
                description: 'set private key of current user'
            },
            options: [
                {
                    key: 'privateKey',
                    name: '-p, --privateKey <privateKey>',
                    description: 'private key'
                }
            ],
            exec: 'setPrivateKey'
        },
        {
            command: {
                name: 'register',
                description: 'register user by login, password'
            },
            options: [
                {
                    key: 'login',
                    name: '-l, --login <login>',
                    description: 'name of the new bitshares account'
                },
                {
                    key: 'password',
                    name: '-p, --password <password>',
                    description: 'password for generating bitshares keys'
                },
            ],
            exec: 'register'
        },
    ];

    static getPrograms(nodeUrl, login, password, privateKey){
        return SchoolApi.init(nodeUrl, login, privateKey).then((api)=>{
            if(!privateKey)
                privateKey = SchoolApi.generateKeys(login, password).pubKeys.active;

            return [
                ...generatePrograms(Api.programs, api),
                ...generatePrograms(StudentApi.programs, api.studentApi),
                ...generatePrograms(TeacherApi.programs, api.teacherApi),
            ];
        });
    }

}

export default Api;