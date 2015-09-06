import React from 'react'
import app from 'app'
import $ from 'jquery'

export default class extends React.Component {

  formChanged(e) {
    var form = $(e.currentTarget)
      , turnpageMethod = form.find('select[name=turnpage-method]').val()
      , scalingMethod = form.find('select[name=scaling-method]').val()
      , mousePositionDragImage = form.find('input[name=mouse-position-drag-image]')
          .prop("checked")
      , autoSplit = form.find('input[name=auto-split]').prop("checked")
      , canvas = app.getModel('canvas')

    canvas.set('scalingMethod', scalingMethod)
    canvas.set('turnpageMethod', turnpageMethod)
    canvas.set('mousePositionDragImage', mousePositionDragImage)
    canvas.set('autoSplit', autoSplit)
  }

  renderScalingMethodSelect() {
    var options = [
          ['AUTO', '自动缩放']
        , ['HORIZONTAL_SCALING', '适应页面宽度']
        , ['SCALE_TO_WINDOW', '适应到窗口']
        ]
      , canvas = app.getModel('canvas')

    return (
      <div className="form-group">
        <label className="control-label" htmlFor="scaling-method">
          画册缩放方式
        </label>
        <select id="scaling-method" className="form-control"
          defaultValue={ canvas.get('scalingMethod') }
          name="scaling-method">
          {
            options.map(([value, label], index) => {
              return (
                <option value={ value } key={ index }>
                  { label }
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

  renderTurnpageMethodSelect() {
    var options = [
          ['CLICK_IAMGE_REGION', '单击图片左右区域进行翻页']
        , ['CLICK', '鼠标单击左右键进行翻页']
        , ['CLICK_TO_SCROLL', '鼠标单击左右键卷动翻页']
        ]
      , canvas = app.getModel('canvas')

    return (
      <div className="form-group">
        <label className="control-label" htmlFor="turnpage-method">
          鼠标翻页方式
        </label>
        <select id="turnpage-method" className="form-control"
          defaultValue={ canvas.get('turnpageMethod') }
          name="turnpage-method">
          {
            options.map(([value, label], index) => {
              return (
                <option value={ value } key={ index }>
                  { label }
                </option>
              )
            })
          }
        </select>
        <p className="help-block">
          * 如果鼠标右键用于翻页, 请使用 `Alt + 鼠标右键` 呼唤右键菜单。
        </p>
      </div>
    )
  }

  renderAutoSplitCheckbox() {
    var canvas = app.getModel('canvas')
    return (
      <div className="form-group">
        <div className="right-block">
          <div className="checkbox">
            <label>
              <input type="checkbox"
                defaultChecked={ canvas.get('autoSplit') }
                name="auto-split"
                /> 自动分页
            </label>
          </div>
        </div>
      </div>
    )
  }

  renderMousePositionDragImageCheckbox() {
    var canvas = app.getModel('canvas')
    return (
      <div className="form-group">
        <div className="right-block">
          <div className="checkbox">
            <label>
              <input type="checkbox"
                defaultChecked={ canvas.get('mousePositionDragImage') }
                name="mouse-position-drag-image"
                /> 通过鼠标位置拖拽图片
            </label>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="config-form-modal">
        <h3>操作设置</h3>
        <form onChange={ ::this.formChanged }
          className="form-horizontal">
          { this.renderScalingMethodSelect() }
          { this.renderTurnpageMethodSelect() }
          { this.renderMousePositionDragImageCheckbox() }
          { this.renderAutoSplitCheckbox() }
        </form>
      </div>
    )
  }
}
