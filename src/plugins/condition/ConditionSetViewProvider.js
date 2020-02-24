/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2020, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import ConditionSet from './components/ConditionSet.vue';
import Vue from 'vue';

export default class ConditionSetViewProvider {
    constructor(openmct) {
        this.openmct = openmct;
        this.key = 'conditionSet.view';
        this.cssClass = 'icon-conditional'; // TODO: replace with class for new icon
    }

    canView(domainObject) {
        return domainObject.type === 'conditionSet';
    }

    canEdit(domainObject) {
        return domainObject.type === 'conditionSet';
    }

    view(domainObject, objectPath) {
        let component;
        const openmct = this.openmct;
        return {
            show: (container, isEditing) => {
                component = new Vue({
                    el: container,
                    components: {
                        ConditionSet
                    },
                    provide: {
                        openmct,
                        domainObject,
                        objectPath
                    },
                    data() {
                        return {
                            isEditing
                        }
                    },
                    template: '<condition-set :isEditing="isEditing"></condition-set>'
                });
            },
            onEditModeChange: (isEditing) => {
                component.isEditing = isEditing;
            },
            destroy: () => {
                component.$destroy();
                component = undefined;
            }
        };
    }
}