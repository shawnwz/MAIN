'''
Kunwang, created on 2017-08-30
2017-08-30:
    Added the call to base init method.
'''
from stbModel.StarHub.StarHub_7428.NFX_ROOT import NFX_ROOT
from PIL import Image


class NFX_CHANNELCHANGE(NFX_ROOT):
    def __init__(self, frame):
        super(NFX_CHANNELCHANGE, self).__init__(frame)
        return

    def navigateToLIVE(self):
        self.personalTrace("NFX_CHANNELCHANGE.navigateToLIVE() enter.")

        self.pressKey("Exit", capScreen = False)
        self.pressKey("Exit", capScreen = False)
        self.pressKey("Exit", capScreen = True)

        self.personalTrace("NFX_CHANNELCHANGE.navigateToLIVE() exit.")
        return
    
    