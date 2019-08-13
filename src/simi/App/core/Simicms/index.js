import React from 'react'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Identify from 'src/simi/Helper/Identify';
import RichText from 'src/simi/BaseComponents/RichText';

/*
* CMS from simiconnector
*/
var ranEval = false

const Simicms  = props => {
    const {csmItem} = props
    if (csmItem && csmItem.cms_content) {
        const title = csmItem.cms_meta_desc?csmItem.cms_meta_desc:csmItem.cms_title?csmItem.cms_title:Identify.__('CMS Page')
        const description = csmItem.cms_meta_title?csmItem.cms_meta_title:Identify.__('CMS Page')

        if (!ranEval && csmItem.cms_script) {
            $.globalEval(csmItem.cms_script)
            ranEval = true
        }
        
        return (
            <React.Fragment>
                {TitleHelper.renderMetaHeader({title, desc: description})}
                <RichText content={csmItem.cms_content} />
            </React.Fragment>
        )
    }
    return ''
}

export default Simicms