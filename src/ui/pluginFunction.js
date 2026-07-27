const plugin =
Laya.plugin = {};

plugin.extractComponents = function(uiView, componentNames) {
    const components = {};
    const deepSearch = (uiView, componentNames) => {
        if(!uiView.child) return;
        for(let i = uiView.child.length - 1; i >= 0; i--) {
            const child = uiView.child[i];
            if(componentNames.includes(child?.props.name)) {
                components[child.props.name] = child;
                uiView.child.splice(i, 1);
                continue;
            }
            deepSearch(child, componentNames);
        }
    };
    deepSearch(uiView, componentNames);
    return componentName => {
        if(components[componentName]) {
            return Laya.View.createComp(components[componentName]);
        }
        return null;
    }
}